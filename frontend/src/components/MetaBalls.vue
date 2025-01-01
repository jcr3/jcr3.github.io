<script setup lang="ts">
    import { onMounted } from 'vue';
    import { makeNoise2D } from 'fast-simplex-noise';
    
    const color = {
        r: 255,
        g: 0,
        b: 255
    }
    const colorSpread = 50;
    const positionSpread = 1;

    onMounted(() => {
        const canvas = <HTMLCanvasElement> document.getElementById("metaballs-canvas");
        if (canvas == null) { console.log("No metaballs-canvas"); return; }
        
        // get simensions of canvas from css size of element
        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;

        let baseRadius = Math.max(800, canvas.width);

        const ctx = canvas.getContext("2d");
        if (ctx == null) { console.log("No metaballs-canvas context"); return };

        function drawGradient(x: number, y: number, radius: number, r: number, g: number, b: number )  {
            const origin = radius/2;
            
            if (ctx) {
                const grd = ctx.createRadialGradient(origin + x, origin + y, 0, origin + x, origin + y, radius/2);
                grd.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
                grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.fillStyle = grd;
                ctx.fillRect(x, y, radius, radius);
            }
        }

        const gradients = [
            {
                radius: baseRadius/2,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/4,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/4,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/8,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/8,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/8,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/10,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/10,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/10,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/10,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            },
            {
                radius: baseRadius/10,
                color: {
                    r: Math.min(Math.max(0, color.r + colorSpread * (2 * Math.random() - 1)), 255),
                    g: Math.min(Math.max(0, color.g + colorSpread * (2 * Math.random() - 1)), 255),
                    b: Math.min(Math.max(0, color.b + colorSpread * (2 * Math.random() - 1)), 255)
                },
                noiseOffset: positionSpread * (2 * Math.random() - 1)
            }
        ];

        window.addEventListener('resize', () => {
            // dynamically resize
            canvas.width = canvas.getBoundingClientRect().width;
            canvas.height = canvas.getBoundingClientRect().height;
            
            baseRadius = Math.max(800, canvas.width);
        });

        const positionNoise = makeNoise2D();

        function animate(t: number) {
            ctx?.clearRect(0, 0, canvas.width, canvas.height);

            gradients.forEach(gradient => {
                const offset = {
                    x: positionNoise(t + gradient.noiseOffset, 0) * baseRadius/8 ,
                    y: positionNoise(0, t + gradient.noiseOffset) * baseRadius/8
                }

                const x0 = canvas.width/2 - gradient.radius/2;
                const y0 = canvas.height/2 - gradient.radius/2;

                drawGradient(x0 + offset.x, y0 + offset.y, gradient.radius, gradient.color.r, gradient.color.g, gradient.color.b);
            });
        }
        let t = 0;
        setInterval(() => {
            animate(t);
            t += 12/1000;
        }, 1000/12); // 12 frames per seconds
    })

</script>

<template>
    <div id="container">
        <canvas
            id="metaballs-canvas"
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
        filter: blur(1em);
        width: 100%;
        height: 100%;
    }
</style>