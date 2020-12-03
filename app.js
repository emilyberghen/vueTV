var vm = new Vue({
	el: '#app',

	data: function () {
		return {
			video_id: null,
			playerVars: {
				autoplay: 1
			},
			input: '',
			results: [],
			currentVideo: [],
			queue: [],
			index: null,
			visibility: true
		};
	},

	computed: {
		player() {
			return this.$refs.youtube.player
		}
	},

	mounted() {
		if (localStorage.getItem('queue')) {
			try {
			  this.queue = JSON.parse(localStorage.getItem('queue'));
			  this.video_id = this.queue[0].video_id;
			  this.currentVideo = this.queue[0];
			  this.visibility = false;
			} catch(e) {
			  localStorage.removeItem('queue');
			}
		}
	},

	methods: {

		searchVideos: function () {
			var self = this;
			var input = encodeURI(this.input);

			if(input) {
				axios.get('https://vuetv.acmoore.co.uk/search/'+input).then(function (response) {
					self.results = response.data;
					console.log(self.results);
				});
			}
		},

		fetchVideo: function (value) {
			this.video_id = value.video_id;
			this.currentVideo = value;
			this.visibility = false;
			this.results = [];
		},

		loadVideo: function (video_id) {
			this.player.loadVideoById(video_id);
		},

		playVideo: function () {
			this.player.playVideo();
		},

		pauseVideo: function () {
			this.player.pauseVideo();
		},

		addQueue: function () {
			var queue = this.queue;
			queue = queue.push(this.currentVideo);

			this.updateStorage();
		},

		removeQueue: function (index) {
			var queue = this.queue;

			if (index > -1) {
				queue.splice(index, 1);
			}

			this.updateStorage();
		},

		next: function () {
			var queue = this.queue;
			var index = queue.indexOf(this.currentVideo);
			var queueLength = queue.length;
			queueLength--;

			if (index > -1 && index < queueLength) {
				this.removeQueue(index);
				this.fetchVideo(queue[index]);
			} else if(index == queueLength && index <= 1) {
				this.removeQueue("0");
				this.player.stopVideo();
			} else if(queueLength > -1) {
				this.fetchVideo(queue[0]);
			} 
		},

		handleBlur: function () {
			this.results = [];
		},

		updateStorage: function () {
			const parsed = JSON.stringify(this.queue);
      		localStorage.setItem('queue', parsed);
		}

	}
});
