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
			visibility: true,
			isPlaying: false
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

		searchVideos: _.debounce(function () {
			var self = this;
			var input = encodeURI(this.input);
 
			if(input) {
				axios.get('https://vuetv.acmoore.co.uk/search/'+input+'%20VEVO').then(function (response) {
					if(response.data.length > 0) {
						self.results = response.data;
						console.log(self.results);
					} else {
						self.results = [];
					}
				});
			}
		}, 500),

		fetchVideo: function (value) {
			this.video_id = value.video_id;
			this.currentVideo = value;
			this.visibility = false;
			this.results = [];
			this.input = '';
		},

		loadVideo: function (video_id) {
			this.player.loadVideoById(video_id);
		},

		playing: function () { 
			this.isPlaying = true;
		},

		paused: function () { 
			this.isPlaying = false;
		},

		handlePlaying: function (value) {
			if(!this.isPlaying){
				this.fetchVideo(value);
			} else {
				this.currentVideo = value;
				this.addQueue();
				this.results = [];
				this.input = '';
			}
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
			this.isPlaying = false;

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

		handleBlur: _.debounce(function () {
			this.results = [];
		}, 300),

		updateStorage: function () {
			const parsed = JSON.stringify(this.queue);
      		localStorage.setItem('queue', parsed);
		}

	}
});
