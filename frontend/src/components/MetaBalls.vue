<script setup lang="ts">
    import { onMounted } from 'vue';
    import { makeNoise3D } from 'fast-simplex-noise';

    

    type Gradient = {
        radius: number,
        noiseOffset: number
    }

    type Vector3 = {
        x: number,
        y: number,
        z: number
    }
    
    let accentColor = hexToRGB("#ff00ff");//hexToRGB(getComputedStyle(document.documentElement).getPropertyValue('--accent-color'));
    let colorSpread = 255;
    const positionSpread = 1;
    const trailSpread = 1;

    const sizeFactor = 1.5;
    const speedFactor = 0.7;
    const colorBlendFactor = 0.5; // lower is slower

    const framerate = 24; // fps

    let threshold = 0.5; // 0 to 1
    let mode = 1; // 0, 1 or 2

    let blur = 0.1;
    if (mode != 0) blur = 1;
    let additionalCss = `filter: blur(${blur}em);`;
    if (mode == 1) additionalCss = `filter: blur(${blur}em) brightness(calc(100% + 50%)) contrast(1000%);`

    const positionNoise = makeNoise3D();

    function getOffset(t: number): Vector3 {
        return {
            x: positionNoise(t, 0, 0),
            y: positionNoise(0, t, 0),
            z: positionNoise(0, 0, t)
        }
    }
    
    function hexToRGB(hex: string): Array<number> {
            hex = hex.replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b];
        }

    function addGradient(baseRadius: number, radiusFactor: number | Array<number>, graidentArray: Array<Gradient>): Array<Gradient> {
        // add one or more gradients to the gradient array
        if (typeof radiusFactor == 'number') {
            graidentArray.push(
                {
                    radius: baseRadius * radiusFactor,
                    noiseOffset: positionSpread * (2 * Math.random() - 1)
                }
            );
        } else {
            radiusFactor.forEach((radiusFactor) => {
                graidentArray.push(
                    {
                        radius: baseRadius * radiusFactor,
                        noiseOffset: positionSpread * (2 * Math.random() - 1)
                    }
                );
            })
        }
        return graidentArray;
    }

    function drawGradient(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: Array<number> )  {
        const origin = radius;
        
        if (context) {
            const grd = context.createRadialGradient(origin + x, origin + y, 0, origin + x, origin + y, radius);
            grd.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
            grd.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

            context.fillStyle = grd;
            context.fillRect(x, y, radius*2, radius*2);
        }
    }
    
    onMounted(() => {

        const canvas = <HTMLCanvasElement> document.getElementById("metaballs-canvas");
        if (canvas == null) { console.log("No metaballs-canvas"); return; }

        window.addEventListener('resize', () => {
            // dynamically resize
            canvas.width = canvas.getBoundingClientRect().width;
            canvas.height = canvas.getBoundingClientRect().height;
            
            baseRadius = Math.max(800, canvas.width);
        });
        
        // get simensions of canvas from css size of element
        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;

        let baseRadius = Math.max(800, canvas.width);

        const ctx = canvas.getContext("2d", {"willReadFrequently": true});

        var gradients: Array<Gradient> = [];
        
        gradients = addGradient(baseRadius, [0.25, 0.125, 0.125, 0.0625, 0.0625, 0.0625, 0.05, 0.05, 0.05, 0.05, 0.05], gradients);
        
        let x0: number;
        let y0: number;
        let offset: Vector3;
        let color = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue('--accent-color'));
        let scaleOffset: number;
    
        // include after image trail
        const scales = [1, 0.9, 0.7];//, 0.6, 0.5, 0.3];

        function animate(t: number) {
            
            if (ctx == null) { console.log("No metaballs-canvas context"); return };

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            accentColor = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue('--accent-color'));

            if(mode == 0) colorSpread = 0;

            gradients.forEach((gradient) => {
                
                scales.forEach((scale) => {

                    const speed = speedFactor * gradient.radius/100;

                    offset = getOffset(t/speed + gradient.noiseOffset - trailSpread * (1 - scale/4));

                    scaleOffset = sizeFactor * 0.5 * ( offset.z + 1.1 );
                    if (scaleOffset < 0.5) scaleOffset = 0.5;

                    x0 = canvas.width/2 - gradient.radius/2 + offset.x * baseRadius/8;
                    y0 = canvas.height/2 - gradient.radius/2 + offset.y * baseRadius/8;
                    
                    if (scale==scales[0])
                    color = [
                        // blend with previous color a bit
                        colorBlendFactor * Math.min(Math.max(accentColor[0] + offset.x * colorSpread, 0), 255) + (1 - colorBlendFactor) * color[0],
                        colorBlendFactor * Math.min(Math.max(accentColor[1] + offset.y * colorSpread, 0), 255) + (1 - colorBlendFactor) * color[1],
                        colorBlendFactor * Math.min(Math.max(accentColor[2] + offset.z * colorSpread, 0), 255) + (1 - colorBlendFactor) * color[2],
                    ];

                    drawGradient(
                        ctx,
                        x0,
                        y0,
                        gradient.radius * scaleOffset,
                        [...color, (scale==scales[0])?scale:scale/2] // draw first one full opacity
                    );
                })
                
            });

            // apply a threshold by opacity on all the graidents to get the metaballs effect
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // mode 1 standard
            if (mode == 0) {
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] < threshold * 255) {
                        data[i + 3] = 0;
                    }
                    else data[i + 3] = 255;
                }
            }
            else if (mode == 1) {
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] < threshold * 255) {
                        data[i] = 0; // red
                        data[i + 1] = 0; // green
                        data[i + 2] = 0; //blue
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);   
        }

        const startTime = Date.now()
        let lastTime = startTime;
        setInterval(() => {
            if (Date.now() - lastTime >= 1000/framerate){
                animate((Date.now() - startTime) / 10000);
                lastTime = Date.now();
            }
        }, 1);
    })

</script>

<template>
    <div id="container">
        <canvas
            id="metaballs-canvas"
            :style="additionalCss"
        >
        </canvas>
    </div>
    
</template>

<style scoped>
    #container{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        mix-blend-mode: screen;

        pointer-events: none;
    }

    #metaballs-canvas {
        width: 100%;
        height: 100%;
    }
</style>