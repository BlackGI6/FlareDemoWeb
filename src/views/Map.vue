<template>
    <main class="map-page">
        <div id="map"></div>
        <button id="center-btn" class="map-control-button" @click="centerMap">
            <span class="material-symbols-outlined">my_location</span>
        </button>
    </main>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css'; 
  import mapPin from '../assets/mapboxPin.png';
  import { onMounted, ref } from 'vue';
  import { db, collection } from '../../firebase.js';
  import { getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

  const eventsAtLocation = ref([]);

  export default {
    name: 'Map',
    data() {
        return {
            map: null,
            initialCenter: [21.236483, 45.750852],
            initialZoom: 18,
            eventsAtLocation: [],
            fetchingEvents: false //fetching the events from the database
        }
    },
    async mounted() {
      mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZGFtaXNpY2kiLCJhIjoiY2xtbzc4YjIyMTl2czJycnh5c2JlaDJuMSJ9.Urz-j3j2fLBah9wAUJpkVg';
  
      this.map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/vladamisici/clpy9cq4g01kx01o9bzobb0hh",
        center: this.initialCenter, // starting position [lng, lat]
        zoom: 0 // starting zoom
      });

      this.map.on('load', () => {
        this.fetchEvents();
        this.addCustomMarker();
        this.map.flyTo({
            center: this.initialCenter,
            zoom: this.initialZoom,
            speed: 2,
            curve: 1
        });
      });
    },
    methods: {
        navigateToInsights() {
            console.log('navigating to /insights');
            this.$router.push('/insights');
        },
        async fetchEvents() {
            this.fetchingEvents = true; //started fetching events
            try {
                const eventsQuery = query(collection(db, 'events'));
                const querySnapshot = await getDocs(eventsQuery);
                querySnapshot.forEach((doc) => {
                    let eventData = doc.data();
                    if(eventData.coordinates[0] === '21.236483' && eventData.coordinates[1] === '45.750852') {
                        console.log('found an event!');
                        this.eventsAtLocation.push(eventData);
                    }
                });
            } catch (error) {
                console.error('Error fetching events from db: ', error);
            } finally {
                this.fetchingEvents = false; //finished fetching events
            }
        },
        async deleteEvent(eventId) {
            console.log('trying to delete event');
            try {
                await deleteDoc(doc(db, 'events', eventId));
                console.log(`Event with ID ${eventId} deleted successfully`);
                this.eventsAtLocation = this.eventsAtLocation.filter(event => event.id !== eventId);
            } catch (error) {
                console.error('Error deleting event: ', error);
            }
        },
        addCustomMarker() {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.backgroundImage = `url(${mapPin})`;

            const marker = new mapboxgl.Marker(el)
                .setLngLat(this.initialCenter)
                .addTo(this.map);

            marker.getElement().addEventListener('click', () => {
                this.showPopup();
            });
        },
        showPopup() {
            if(!this.fetchingEvents) {
                const popupContent= this.createPopupContent();
                new mapboxgl.Popup({ offset: 25, closeButton: true, closeOnClick: false })
                    .setLngLat(this.initialCenter)
                    .setHTML(popupContent)
                    .addTo(this.map);
            } else {
                console.log('ERR Showing PopUp: Events are still fetching from db');
            }
        },
        createPopupContent() {
            console.log('populating map-pin-popup!');
            let content = '<div class="event-popup">';
            this.eventsAtLocation.forEach(event => {
                content += `
                <div class="event-panel">
                    <h3 class="event-title">${event.name}</h3>
                    <p class="event-description-label">Description:</p>
                    <p class="event-description">${event.description}</p>
                    <p>Date: ${event.date}</p>
                    <p>Time: ${event.startTime} - ${event.endTime}</p>
                    <div class="event-actions">
                    <button class="event-button" @click="navigateToInsights">Event Insights</button>
                    <button class="event-button delete" data-id="${event.id}">Delete Event</button>
                    </div>
                </div>`;
            });
            content += '</div>';
            return content;
        },
        zoomOut() {
            this.map.zoomOut();
        },
        centerMap() {
        this.map.flyTo({
            center: this.initialCenter,
            zoom: this.initialZoom,
            speed: 1,
            curve: 1
        });
        },
        zoomIn() {
            this.map.zoomIn();
        },
        createPopupContent() {
            let content = document.createElement('div');
            content.className = 'event-popup';

            this.eventsAtLocation.forEach(event => {
                let panel = document.createElement('div');
                panel.className = 'event-panel';

                let title = document.createElement('h3');
                title.className = 'event-title';
                title.textContent = event.name;
                panel.appendChild(title);

                let descriptionLabel = document.createElement('p');
                descriptionLabel.className = 'event-description-label';
                descriptionLabel.textContent = 'Description:';
                panel.appendChild(descriptionLabel);

                let description = document.createElement('p');
                description.className = 'event-description';
                description.textContent = event.description;
                panel.appendChild(description);

                let date = document.createElement('p');
                date.textContent = `Date: ${event.date}`;
                panel.appendChild(date);

                let time = document.createElement('p');
                time.textContent = `Time: ${event.startTime} - ${event.endTime}`;
                panel.appendChild(time);

                let actions = document.createElement('div');
                actions.className = 'event-actions';

                let insightsButton = document.createElement('button');
                insightsButton.className = 'event-button';
                insightsButton.textContent = 'Event Insights';
                insightsButton.setAttribute('data-action', 'insights');
                actions.appendChild(insightsButton);

                let deleteButton = document.createElement('button');
                deleteButton.className = 'event-button delete';
                deleteButton.textContent = 'Delete Event';
                deleteButton.setAttribute('data-id', event.id);
                deleteButton.setAttribute('data-action', 'delete');
                actions.appendChild(deleteButton);

                panel.appendChild(actions);
                content.appendChild(panel);
            });

            return content.outerHTML;
        }
    }
  };
  </script>
  
  <style>
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .custom-marker {
    background-size: cover;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    animation: pulse 1.5s infinite;
}

.mapboxgl-popup .mapboxgl-popup-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: #333;
  width: 400px;
  overflow: hidden;
}

.popup-content {  
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
}

.event-panel {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
}
.event-entry {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.event-title {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.event-description-label {
    font-weight: bold;
}
.event-description {
  font-size: 10px;
  margin-bottom: 10px;
}

.event-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.event-button {
    padding: 8px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #89CFF0;
    color:#fff;
    transition: background-color 0.3s;
}

.event-button:hover {
  background-color: #89EDFF;
}

.event-button.delete {
  background-color: #ffb3b3;
}

.event-button.delete:hover {
  background-color: #ff9999;
}

.event-info {
  font-size: 12px;
  color: #666;
  display:flex;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.mapboxgl-popup .mapboxgl-popup-content {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    25% {
        opacity: 0.9;
    }
    50% {
        opacity: 0.83;
    }
    75% {
        opacity: 0.9;
    }
    100% {
        opacity: 1;
    }
}

.map-control-button {
    position: fixed;
    bottom: 20px;
    right: 40%;
    z-index: 2;
    padding: 15px 15px;
    background-color: rgba(105, 225, 247, 0.2); /* Semi-transparent background */
    backdrop-filter: blur(5px); /* Blur effect */
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-control-button:hover {
  background-color: rgba(105, 225, 247, 0.5); /* Semi-transparent background */
  backdrop-filter: blur(5px); /* Change color on hover */
  transform: scale(1.1);
}

.map-control-button .material-symbols-outlined {
  font-size: 24px; /* Adjust the size of the icon */
  color: #333;
}
/*#center-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1; /* Ensure the button is above the map */
  /* Add more styles for your button here */
  </style>
  