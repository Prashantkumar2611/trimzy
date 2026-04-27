    let map, marker, geocoder, autocomplete;
    window.initMap = function () {
      // Default center: Bhubaneswar
      const defaultPos = { lat: 20.2961, lng: 85.8245 };
      geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map-picker'), {
        center: defaultPos, zoom: 14,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
      });
      marker = new google.maps.Marker({
        position: defaultPos, map, draggable: true,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
      });
      // Update coords and address when marker dragged
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        setCoords(pos.lat(), pos.lng(), true);
      });
      // Click on map to move marker
      map.addListener('click', (e) => {
        marker.setPosition(e.latLng);
        setCoords(e.latLng.lat(), e.latLng.lng(), true);
      });
      // Search box
      const input = document.getElementById('map-search');
      autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'in' },
        fields: ['geometry', 'formatted_address', 'name']
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        marker.setPosition(place.geometry.location);
        setCoords(place.geometry.location.lat(), place.geometry.location.lng());
        // Also fill address field
        if (place.formatted_address) {
          document.getElementById('pf-address').value = place.name ? place.name + ', ' + place.formatted_address : place.formatted_address;
        }
      });
      // Load saved location if exists
      const savedLat = document.getElementById('pf-lat').value;
      const savedLng = document.getElementById('pf-lng').value;
      if (savedLat && savedLng) {
        const pos = { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
        map.setCenter(pos); map.setZoom(17);
        marker.setPosition(pos);
        document.getElementById('map-coords-display').style.display = 'block';
      }
    };
    function setCoords(lat, lng, updateAddress = false) {
      document.getElementById('pf-lat').value = lat;
      document.getElementById('pf-lng').value = lng;
      document.getElementById('map-coords-display').style.display = 'block';

      // Uber-style reverse geocoding
      if (updateAddress && geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const input = document.getElementById('pf-address');
            if (input) {
              input.value = address;
              // Trigger any listeners if needed
              input.dispatchEvent(new Event('input'));
            }
          }
        });
      }
    }

    // ── Location Button Handlers ──
    document.addEventListener('DOMContentLoaded', () => {
      const btnUseCurrent = document.getElementById('btn-use-current');
      const btnSearchManual = document.getElementById('btn-search-manual');
      const manualMapSection = document.getElementById('manual-map-section');

      if (!btnUseCurrent) return;

      btnSearchManual.addEventListener('click', () => {
        btnSearchManual.style.background = 'rgba(232,164,74,.06)';
        btnSearchManual.style.border = '1.5px solid var(--gold)';
        btnSearchManual.style.color = 'var(--navy)';
        btnSearchManual.innerHTML = '<span>🔍</span> Search Location';

        btnUseCurrent.style.background = '#fff';
        btnUseCurrent.style.border = '1.5px solid var(--border)';
        btnUseCurrent.style.color = 'var(--navy)';
        btnUseCurrent.innerHTML = '<span>📍</span> Use Current Location';

        manualMapSection.style.display = 'block';
      });

      btnUseCurrent.addEventListener('click', () => {
        btnUseCurrent.style.background = 'rgba(232,164,74,.06)';
        btnUseCurrent.style.border = '1.5px solid var(--gold)';
        btnUseCurrent.style.color = 'var(--navy)';
        btnUseCurrent.innerHTML = '<div class="spin" style="width:14px;height:14px;margin:0;border-width:2px;display:inline-block;vertical-align:middle"></div> <span style="vertical-align:middle">Locating...</span>';

        btnSearchManual.style.background = '#fff';
        btnSearchManual.style.border = '1.5px solid var(--border)';
        btnSearchManual.style.color = 'var(--navy)';

        if (!navigator.geolocation) {
          showToast('Geolocation is not supported by your browser', 'error');
          btnSearchManual.click();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const pos = { lat, lng };

            manualMapSection.style.display = 'block';
            if (map && marker) {
              map.setCenter(pos);
              map.setZoom(17);
              marker.setPosition(pos);
            }
            setCoords(lat, lng, true);

            // Reset button
            btnUseCurrent.innerHTML = '<span>✅</span> Located successfully';
            setTimeout(() => {
              btnUseCurrent.innerHTML = '<span>📍</span> Use Current Location';
            }, 3000);
          },
          (error) => {
            showToast('Location permission denied or failed.', 'error');
            btnSearchManual.click();
            btnUseCurrent.innerHTML = '<span>📍</span> Use Current Location';
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    });
