<template>
    <main class="home-page">
        <div id="app">
            <vue-particles
                id="tsparticles"
                :particlesInit="particlesInit"
                :particlesLoaded="particlesLoaded"
                :options="particlesOptions"
            />
            <div class="logo-container">
                <div class="logo">
                    <span class="flare-logo-text">flare.</span>
                    <span class="events">events</span>
                </div>
            <p class="tagline">Expanding Possibilities for Your Flare Events</p>
            <hr class="divider" />
            <ul class="features-list">
                <li>Create and Customize Events</li>
                <li>Manage your tickets</li>
                <li>In-App Previews</li>
            </ul>
            <button class="view-demo-button"
                    @mousemove="moveGradient($event)"
                    :style="gradientStyle"
            >View Demo</button>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { ref } from 'vue';
    import { loadSlim } from "tsparticles-slim";
    import Particles from "vue3-particles";

    const particlesOptions = ref({
        background: {
            color: {
                value: '#f1f5f9'
            }
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: 'push'
                },
                onHover: {
                    enable: true,
                    mode: 'repulse'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40
                },
                push: {
                    quantity: 4
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                }
            }
        },
        particles: {
            color: {
                value: '#a467ff'
            },
            links: {
                color: '#a467ff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1
            },
            move: {
                direction: 'none',
                enable: true,
                outMode: 'bounce',
                random: false,
                speed: 3,
                straight: false
            },
            number: {
                density: {
                    enable: true,
                    area: 800
                },
                value: 80
            },
            opacity: {
                value: 0.5
            },
            shape: {
                type: 'circle'
            },
            size: {
                random: true,
                value: 5
            }
        },
        detectRetina: true
    });

    const particlesInit = async engine => {
        await loadSlim(engine);
    };

    const particlesLoaded = async container => {
        console.log("Particles container loaded", container);
    };


    const gradientStyle = ref({});

    function moveGradient(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left; // x position within the element.
        const y = event.clientY - rect.top;  // y position within the element.

        const xPercent = Math.round((x / rect.width) * 100);
        const yPercent = Math.round((y / rect.height) * 100);

        gradientStyle.value = {
            background: `radial-gradient(circle at ${xPercent}% ${yPercent}%, #89CFF0, #a467ff)`,
        };
    }
</script>

<style lang="scss" scoped>
    .home-page {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        background: transparent;
    }

    #tsparticles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
    }
    
    .logo-container {
        padding: 20px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
                    0 0 0 1px #a467ff,
                    0 0 0 2px #89CFF0; 
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .divider {
            border: none;
            height: 1px;
            background: linear-gradient(270deg, #a467ff, #89CFF0, #a467ff, #89CFF0);
            background-size: 200% 200%;
            animation: moveGradient 4s ease infinite;
            margin: 20px 0;
        }
        .logo {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: baseline;
            .flare-logo-text, .events {
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(270deg, #a467ff, #89CFF0, #a467ff, #89CFF0);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            color: transparent;
            animation: moveGradient 4s ease infinite;
            }

            .events {
            font-size: 2rem;
            font-style: italic;
            background: linear-gradient(90deg, #89CFF0, #a467ff);
            -webkit-background-clip: text;
            color: transparent;
            margin-left: 0.5rem;
            }
        }

        .tagline {
            margin-top: 1rem;
            font-size: 1.2rem;
            color: #334155;
        }

        .features-list {
            list-style: none;
            padding: 0;
            margin-top: 30px;
            text-align: left;
            font-size: 1.1rem;

            li {
                position: relative;
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 8px;
                transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

                &:before {
                    content: '✓';
                    color: #a467ff;
                    margin-right: 10px;
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                &:hover {
                    transform: translateX(5px);
                }
            }
        }

        .view-demo-button {
            margin-top: 30px;
            padding: 12px 22px;
            font-size: 1rem;
            font-weight: bold;
            color: white;
            border: none;
            border-radius: 25px;
            background: linear-gradient(135deg, #a467ff, #89CFF0);
            cursor: pointer;
            outline: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                background: linear-gradient(135deg, #89CFF0, #a467ff);
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }

            &:active {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transform: translateY(1px);
            }
        }

        @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    }
</style>