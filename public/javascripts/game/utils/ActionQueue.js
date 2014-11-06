if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function ActionQueue(context) {
		this._context = context || this;
		this.clear();
	}
	ActionQueue.prototype.tick = function() {
		this._frame++;
		this._hasPriority = true;
		this._runNextAction();
		return this;
	};
	ActionQueue.prototype.then = function(action) {
		this._futureActions.push(action);
		return this;
	};
	ActionQueue.prototype.wait = function(numFrames) {
		this.then(function(frame, done) {
			if(frame >= numFrames) {
				done(true);
			}
		});
		return this;
	};
	ActionQueue.prototype.clear = function() {
		this._frame = 0;
		this._startFrameOfCurrentAction = 0;
		this._currentAction = null;
		this._hasPriority = true;
		this._futureActions = [];
		return this;
	};
	ActionQueue.prototype.isEmpty = function() {
		return this._currentAction === null && this._futureActions.length === 0;
	};
	ActionQueue.prototype.readyForInput = function() {
		return this.isEmpty() && this._hasPriority;
	};
	ActionQueue.prototype._runNextAction = function() {
		var self = this;
		if(!this._currentAction && this._futureActions.length > 0) {
			this._currentAction = this._futureActions.shift();
			this._startFrameOfCurrentAction = this._frame;
		}
		if(this._currentAction) {
			this._currentAction.call(
				this._context,
				this._frame - this._startFrameOfCurrentAction,
				function(runNextAction) { self._clearCurrentAction(runNextAction); }
			);
		}
	};
	ActionQueue.prototype._clearCurrentAction = function(runNextAction) {
		this._currentAction = null;
		if(runNextAction) {
			this._runNextAction();
		}
		else {
			this._hasPriority = false;
		}
	};
	return ActionQueue;
});