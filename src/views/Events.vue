<template>
    <div class="event-form-container">
      <h1 class="form-title">
        <span v-for="(letter, index) in splitTitle" :key="index" class="title-letter" v-html="letter === ' ' ? '&nbsp' : letter"></span>
      </h1>
      <form @submit.prevent="submitForm" class="event-form">
  
        <!-- Event Name -->
        <div class="form-group floating">
          <input type="text" id="eventName" v-model="event.name" required>
          <label for="eventName">Event Name</label>
        </div>
  
        <!-- Event Description -->
        <div class="form-group floating">
          <textarea id="eventDescription" v-model="event.description" required></textarea>
          <label for="eventDescription">Description</label>
        </div>
  
        <!-- Event Date -->
        <div class="form-group">
            <label for="eventDate">Event Date</label>
            <input type="date" id="eventDate" v-model="event.date" required>
        </div>

        <!-- Event Start & End Time -->
        <div class="form-group">
            <label for="eventHours">Event Hours</label>
            <input type="time" id="eventStartTime" v-model="event.startTime" required>
            <input type="time" id="eventEndTime" v-model="event.endTime" required>
        </div>
  
        <!-- Event Type -->
        <div class="form-group floating">
          <select id="eventType" v-model="event.type">
            <option value="" disabled selected>Select Event Type</option>
            <option value="party">Party</option>
            <option value="concert">Concert</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
          <label for="eventType">Type of Event</label>
        </div>
  
        <!-- Fixed Location -->
        <div class="form-group fixed-location">
            <div class="location-container">
                <img :src="mapPin" alt="Map Pin" class="map-pin-icon">
                <div>
                    <router-link to="/map" class="location-link">
                        Fratelli Lounge&Club
                    </router-link>
                    <p class="location-address">Bulevardul Corneliu Coposu 3, Timișoara</p>
                </div>
            </div>
        </div>
  
        <!-- Submit Button -->
        <div class="create-event-button-container">
            <button class="create-event-button"
                                @mousemove="moveGradient($event)"
                                :style="gradientStyle"
            >Create Event</button>
        </div>

        <div class="ticket-link-container">
            <router-link to="/tickets" class="ticket-link">Use Flare QR Tickets</router-link>
            <div class="info-button-container">
                <button class="info-button">?</button>
                <div class="popup-info-message">Use our QR Ticketing service for your events.</div>
            </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import mapPin from '../assets/mapboxPin.png';
  import { db, collection, addDoc } from '../../firebase.js';

  const title = "Add your event to Flare";
  const splitTitle = computed(() => title.split(""));

  const gradientStyle = ref({
    background: 'linear-gradient(135deg, #a467ff, #89CFF0)',
  })
  
  const backgroundStyle = ref({})

  const event= ref( {
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    coordinates: ['21.236483', '45.750852']
  });

  const submitForm = async () => {
    try{
        const docRef = await addDoc(collection(db, 'events'), event.value);
        console.log('Event added with ID: ', docRef.id);
    } catch(error) {
        console.error("Error adding event: ", error);
    }
  }

  function updateBackground(event) {
  const x = event.clientX;
  const y = event.clientY;
  const gradientStyle = `radial-gradient(circle at ${x}px ${y}px, #89CFF0, #a467ff)`;
  document.body.style.background = gradientStyle;
}

onMounted(() => {
  document.body.style.backgroundColor = '#a467ff';
  window.addEventListener('mousemove', updateBackground);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', updateBackground);
  document.body.style.background = ''; // Reset background when component is unmounted
});

  function moveGradient(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = Math.round((x / rect.width) * 100);
    const yPercent = Math.round((y / rect.height) * 100);

    gradientStyle.value = {
        background: `radial-gradient(circle at ${xPercent}% ${yPercent}%, #89CFF0, #a467ff)`,
    };
  }

  </script>
  
  <style lang="scss">
  .event-form-container {
    height: 900px;
    width: 600px;
    margin: 40px auto;
    padding: 80px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    color: #333;
  
    .form-title {
      text-align: center;
      margin-bottom: 30px;
      color: #a467ff;
      user-select: none;
      font-size: 2rem;
      background: linear-gradient(135deg, #a467ff, #89CFF0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);

      .title-letter {
        display: inline-block;
        transition: transform 0.2s ease;
        vertical-align: middle;
        &:hover {
            /*transform: translateY(-10px);
            color: #a467ff !important; // Maintain the original color
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);*/
        }
      }

    }
  
    .form-group {
      position: relative;
      margin-bottom: 25px;
  
      &.floating {
        textarea{
            resize: vertical;
        }

        input, textarea, select {
          border: 2px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          width: 100%;
          font-size: 1rem;
          transition: border-color 0.3s;
  
          &:focus {
            border-color: #a467ff;
            outline: none;
          }
  
          &:focus + label, &:not(:placeholder-shown) + label {
            top: -10px;
            left: 10px;
            background: #fff;
            padding: 0 5px;
            font-size: 0.85rem;
            color: #a467ff;
          }
        }
  
        label {
          position: absolute;
          top: 15px;
          left: 15px;
          transition: all 0.3s;
          pointer-events: none;
          background-color: transparent;
        }
      }
  
      input[type="date"], input[type="time"] {
        background: #fff;
        border: 2px solid #ddd;
        border-radius: 5px;
        padding: 12px;
        width: 100%;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;

        &:focus {
            border-color: #a467ff;
            box-shadow: 0 0 8px rgba(164, 103, 255, 0.2);
            outline: none;
        }

      }
      }
    }

    .location-container{
        display: flex;
        align-items: center;
        .map-pin-icon {
            width: 45px;
            height: 45px;
            margin-right: 1px;
        }
        .location-link, .location-address {
            margin: 0;
        }
        .location-address{
            font-size: small;
        }
    }

    .fixed-location {
        .location-link {
          color: #a467ff;
          text-decoration: underline;
          transition: transform 0.3s ease;
          &:hover {
            transform: translateX(5px);
            text-decoration: none;
          }
        }
  
        .location-address {
          color: #333;
        }
      }

    .create-event-button-container{
        text-align: center;
    }
    .create-event-button {
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

    .ticket-link-container{
        text-align: center;
        margin-top: 20px;

        .ticket-link{
            color: #333;
            text-decoration: underline;
            margin-right: 10px;
            font-size: 0.85rem;
        }

        .info-button-container{
            display: inline;
            position: relative;

            .info-button{
                background: var(--gray);
                border: none;
                color: white;
                cursor: pointer;
                font-size: 0.75rem;
                width: 20px;
                height: 20px;
                border-radius: 50%; /* Makes the button circular */
                text-align: center;
                line-height: 20px; /* Centers the text vertically */
            }

            .popup-info-message {
            visibility: hidden;
            width: 200px;
            background-color: rgba(153, 200, 237, 0.1); /* semi-transparent white */
            backdrop-filter: blur(10px); /* blur effect */
            color: var(--gray);
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            top: 125%;
            left: 50%;
            margin-left: -100px; /* Center the popup */
            opacity: 0;
            transition: opacity 0.3s;

            /* Arrow */
            &:after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #f9f9f9 transparent transparent transparent;
            }
            }

            .info-button:hover + .popup-info-message {
                visibility: visible;
                opacity: 1;
            }
        }
        }
  
  </style>
  