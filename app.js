Vue.component('v-select', VueSelect.VueSelect);

new Vue({
	el: '#app',

	data: function () {
		return {
			search: null,
			video_id: null,
			playerVars: {
				autoplay: 1
			},
			results: []
		};
	},

	computed: {
		player() {
			return this.$refs.youtube.player
		}
	},

	methods: {
		searchVideos: function(search) {
			var self = this;
			var input = encodeURI(search);

			if(input) {
				console.log(input);
				axios.get('https://vuetv.acmoore.co.uk/search/'+input).then(function (response) {
					self.results = response.data;
				});
			}
		},

		fetchVideo: function(value) {
			var self = this;
			self.loadVideo(value);
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

	}
});
