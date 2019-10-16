const locations = [
	{
		name: "Bloc 1",
		coords: {
			lat: 45.617313,
			lng: 25.651346
		}
	},
	{
		name: "Fabrica de bere Aurora",
		coords: {
			lat: 45.617898,
			lng: 25.652204
		}
	},
];

const geolocationOptions = {
	enableHighAccuracy: true,
	maximumAge: 0,
	timeout: 27000,
};

const enableMotionSensors = () => {
	if (typeof DeviceMotionEvent.requestPermission === "function" && typeof DeviceOrientationEvent.requestPermission === "function") {
		DeviceMotionEvent.requestPermission()
		.then((permissionState) => {
			if (permissionState === 'granted') {
				window.addEventListener('devicemotion', () => {});
			}
		})
        .catch((err) => console.error(`An error occured: ${err}`));

		DeviceOrientationEvent.requestPermission()
		.then((permissionState) => {
			if (permissionState === 'granted') {
				window.addEventListener('deviceorientation', () => {});
			}
		})
        .catch((err) => console.error(`An error occured: ${err}`));
	}
}

const setLocations = () => {
	const scene = document.querySelector("a-scene");

	navigator.geolocation.getCurrentPosition(position => {
		for (let location of locations) {
			const latitude = location.coords.lat;
			const longitude = location.coords.lng;

			// add place icon
			const icon = document.createElement("a-image");
			icon.setAttribute("gps-entity-place", `latitude: ${latitude}; longitude: ${longitude}`);
			icon.setAttribute("name", location.name);
			icon.setAttribute("value", location.name);
			icon.setAttribute("src", "../assets/map-marker.png");

			icon.setAttribute("scale", "10, 10");

			icon.addEventListener("loaded", () => window.dispatchEvent(new CustomEvent("gps-entity-place-loaded")));

			const clickListener = (ev) => {
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
		}
	},
	(err) => console.error(`An error occured: ${err}`),
	geolocationOptions);
};

window.onload = () => {
	setLocations();
};
