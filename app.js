Vue.component('v-select', VueSelect.VueSelect);

var vm = new Vue({
	el: '#app',

	data: function () {
		return {
			video_id: null,
			playerVars: {
				autoplay: 1
			},
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

		// video

		searchVideos: function (search) {
			var self = this;
			var input = encodeURI(search);

			if(input) {
				axios.get('https://vuetv.acmoore.co.uk/search/'+input).then(function (response) {
					self.results = response.data;
				});
			}
		},

		fetchVideo: function (value) {
			this.video_id = value.video_id;
			this.currentVideo = value;
			this.visibility = false;
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

		// queue

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
				index++;
				this.fetchVideo(queue[index]);
			}
		},

		updateStorage: function () {
			const parsed = JSON.stringify(this.queue);
      		localStorage.setItem('queue', parsed);
		}

	}
});
