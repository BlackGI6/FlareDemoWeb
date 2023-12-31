<template>
  <aside :class="`${is_expanded ? 'is-expanded' : '' }`">
    <div class="logo">
        <img src="../assets/FlareLogo_white.png" alt="Flare">
    </div>

    <div class="menu-toggle-wrap">
        <button class="menu-toggle" @click="ToggleMenu">
            <span class="material-symbols-outlined">
                arrow_forward_ios
            </span>
        </button>
    </div>
    
    <h3>Menu</h3>
    <div class="menu">
        <router-link class="button" to="/">
            <span class="material-symbols-outlined">home</span>
            <span class="text">Home</span>
        </router-link>
        <router-link class="button" to="/events">
            <span class="material-symbols-outlined">celebration</span>
            <span class="text">Events</span>
        </router-link>
        <router-link class="button" to="/tickets">
            <span class="material-symbols-outlined">content_copy</span>
            <span class="text">Tickets</span>
        </router-link>
        <router-link class="button" to="/map">
            <span class="material-symbols-outlined">explore_nearby</span>
            <span class="text">Map</span>
        </router-link>
        <router-link class="button" to="/event-insights">
            <span class="material-symbols-outlined">bar_chart</span>
            <span class="text">Event Insights</span>
        </router-link>
    </div>

    <div class="flex"></div>
    <div class="menu">
        <router-link class="button" to="/settings">
            <span class="material-symbols-outlined">settings</span>
            <span class="text">Settings</span>
        </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value  
    
    localStorage.setItem("is_expanded", is_expanded.value)            
}
</script>

<style lang="scss" scoped>
aside {

    display: flex;
    flex-direction: column;
    width: calc(2rem + 32px);
    min-height: 100vh;
    overflow: hidden;
    padding: 1rem;

    background-color: var(--dark);
    color: var(--light);

    transition: 0.2s ease-out;

    .flex {
        flex: 1 1 0;
    }

    .logo {
        margin-bottom: 1rem;

        img{
            width: 2rem;
        }
    }

    .menu-toggle-wrap{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;

        position: relative;
        top: 0;
        transition: 0.2s ease-out;

        .menu-toggle {
            transition: 0.2s ease-out;

            .material-symbols-outlined {
                font-size: 2rem;
                color: var(--light);
            }

            &:hover {
                .material-symbols-outlined{
                    color: var(--primary);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    h3, .button .text{
        opacity: 0;
        transition: 0.3s ease-out;
    }

    h3 {
        color: var(--gray);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }
    .menu {
        margin: 0 -1rem;

        .button{
            display: flex;
            align-items: center;
            text-decoration: none;

            padding: 0.5rem 1rem;
            transition: 0.2s ease-out;

            .material-symbols-outlined {
                font-size: 2rem;
                color: var(--light);
                transition: 0.2s ease-out;
            }

            .text {
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover, &.router-link-exact-active {
                background-color: var(--dark-alt);

                .material-symbols-outlined, .text {
                    color: var(--primary);
                }
            }

            &.router-link-exact-active {
                border-right: 5px solid var(--primary);
            }
        }
    }

    &.is-expanded {
        width: var(--sidebar-width);

        .menu-toggle-wrap {
            top: -3rem;
            .menu-toggle {
                transform: rotate(-180deg);
            }
        }

        h3, .button .text{
        opacity: 1;
        }

        .button {
            .material-symbols-outlined {
                margin-right: 1rem;
            }
        }
    }
    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
}
</style>