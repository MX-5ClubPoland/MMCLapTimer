/**
 * @constructor
 * @params {String} localDbName
 * @params {String} remoteDbUrl
 * @params {{}[]} results
 *
 * Options:
 *  {function} onUpdate([{}] updatedResults)
 */
MMCLapTimer.ResultsFeed = (function() {

	var options;
	var local;
	var remote;
	var sync;
	var remoteInfo;

	var ResultsFeed = function(localDbName, remoteDbUrl, userOptions) {
		options = userOptions || {
			onUpdate: function(updatedResults) {
				console.log('Results update: ', updatedResults);
				return updatedResults;
			}
		};
		this.localDbName = localDbName;
		this.remoteDbUrl = remoteDbUrl;
		this.results = [];

		local = new PouchDB(this.localDbName, {auto_compaction: true});
		remote = new PouchDB(this.remoteDbUrl);
		remote.info().then(function(info) {
			remoteInfo = info;
		})
	};

	ResultsFeed.prototype.startSync = function(onUpdate) {
		var that = this;
		// console.log('SYNC START');
		options.onUpdate = onUpdate || options.onUpdate;
		return sync = local.replicate.from(remote, {
			live: true,
			retry: true
		})
			// .on('complete', function() {
			// 	console.log('sync completed');
			// })
			.on('change', function(info) {
				console.log('Synchronization: ' + that.syncProgress() + '%');
				if (typeof options.onUpdate === 'function') {
					options.onUpdate(info.docs);
				}
			})
			// .on('paused', function(info) {
			// 	console.log('sync paused', info);
			// })
			// .on('active', function(info) {
			// 	console.log('sync resumed', info);
			// })
			.on('error', function(error) {
				console.error('Synchronization error', error);
			});
	};

	ResultsFeed.prototype.stopSync = function() {
		// console.log('SYNC STOP');
		if (sync) {
			sync.cancel();
		}
	};

	ResultsFeed.prototype.reloadResults = function() {
		var that = this;
		return local.allDocs({include_docs: true})
			.then(function(response) {
				return that.results = response.rows.map(function(row) {
					return row.doc;
				});
			}).catch(function(error) {
				return local.destroy();
			});
	};

	ResultsFeed.prototype.isSynchronized = function() {
		return remoteInfo !== undefined && (remoteInfo.doc_count === 0 || this.results.length >= remoteInfo.doc_count);
	};

	ResultsFeed.prototype.syncProgress = function() {
		if (remoteInfo !== undefined && remoteInfo.doc_count > 0) {
			if (this.results.length > remoteInfo.doc_count) {
				return 100;
			} else {
				return Math.round(this.results.length / remoteInfo.doc_count * 100);
			}
		} else {
			return 0;
		}
	};

	return ResultsFeed;
})();
