const loadPlaces = function() {
	const PLACES = [
		{
			name: "Locatie 1",
			location: {
				lat: 45.617313, // latitude if using static data
				lng: 25.651346 // add here longitude if using static data
			}
		},
		{
			name: "Locatie 2",
			location: {
				lat: 45.617898, // latitude if using static data
				lng: 25.652204 // add here longitude if using static data
			}
		},
	];

	return Promise.resolve(PLACES);
};

const grantAccessToIosAPI = () => {
	DeviceMotionEvent.requestPermission();
	DeviceOrientationEvent.requestPermission();
};

window.onload = () => {
	const scene = document.querySelector("a-scene");
	const button = document.getElementById("enableIosAPI");

	if (typeof DeviceMotionEvent.requestPermission === "function" && typeof DeviceOrientationEvent .requestPermission === "function") {
		// iOS 13+
		button.style.display = "block";

		button.addEventListener("click", (ev) => {
			grantAccessToIosAPI();
		});
	}

	// first get current user location
	return navigator.geolocation.getCurrentPosition(function (position) {
		loadPlaces()
			.then((places) => {
				places.forEach((place) => {
					const latitude = place.location.lat;
					const longitude = place.location.lng;

					// add place icon
					const icon = document.createElement("a-image");
					icon.setAttribute("gps-entity-place", `latitude: ${latitude}; longitude: ${longitude}`);
					icon.setAttribute("name", place.name);
					icon.setAttribute("value", place.name);
					icon.setAttribute("src", "../assets/map-marker.png");

					// for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
					icon.setAttribute("scale", "10, 10");

					icon.addEventListener("loaded", () => window.dispatchEvent(new CustomEvent("gps-entity-place-loaded")));

					const clickListener = function(ev) {
						ev.stopPropagation();
						ev.preventDefault();

						const name = ev.target.getAttribute("name");

						const el = ev.detail.intersection && ev.detail.intersection.object.el;

						if (el && el === ev.target) {
							const label = document.createElement("span");
							const container = document.createElement("div");
							container.setAttribute("id", "place-label");
							label.innerText = name;
							container.appendChild(label);
							document.body.appendChild(container);

							setTimeout(() => {
								container.parentElement.removeChild(container);
							}, 1500);
						}
					};

					icon.addEventListener("click", clickListener);
					
					scene.appendChild(icon);
				});
			});
	},
	(err) => console.error("Error in retrieving position", err),
	{
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: 27000,
	});
};
