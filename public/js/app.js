document.addEventListener("DOMContentLoaded", event => {
	getStream();
});

const getStream = async () => {
	const videoContainer = document.querySelector('video');
	const constraints = {
		video: {
			width: { 
				min: 400,
				ideal: 600,
				max: 600,
			},
			height: {
				min: 400,
				ideal: 600,
				max: 600,
			},
			facingMode: {
				exact: "environment"
			}
		}
	};

	try {
		if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
			const videoStream = await navigator.mediaDevices.getUserMedia(constraints);

			videoContainer.srcObject = videoStream;

			videoContainer.play();
		}
	}
	catch (err) {
		console.warn(`There was an error: ${err.message.toLowerCase()}`);
	}
};
