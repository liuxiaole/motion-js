(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        root.Motion = factory(root.jQuery);
    }
}(this, function (jQuery) {
    function Path(path){
        this.pathEl = this.createPathEl(path);
        this.pathTotalLength = this.pathEl.getTotalLength();
    }

    Path.prototype.createPathEl = function(path){
        var SVG_NS = 'http://www.w3.org/2000/svg';
        var pathEl = document.createElementNS(SVG_NS, 'path');
        pathEl.setAttribute('d', path);
        return pathEl;
    };

    Path.prototype.getAt = function(percent){
        var len1 = this.pathTotalLength * percent;
        var len0 = len1 - 0.5;
        var len2 = len1 + 0.5;
        if(len0 < 0) {
            len0 = 0;
        }
        if(len2 > this.pathTotalLength) {
            len2 = this.pathTotalLength;
        }
        var point0 = this.pathEl.getPointAtLength(len0);
        var point1 = this.pathEl.getPointAtLength(len1);
        var point2 = this.pathEl.getPointAtLength(len2);

        var dx = point2.x - point0.x;
        var dy = point2.y - point0.y;
        var rotate = Math.atan(dy / dx);
        if(dx < 0) {
            rotate += Math.PI;
        }

        return {
            x: point1.x,
            y: point1.y,
            rotate: (rotate / Math.PI * 180) % 360
        };

    };

    function Motion(el, options){
        if(this.constructor.isSupport) {
            this.path = new Path(options.path);
        }
        this.options = jQuery.extend({}, this.defaultOptions, options);
        this.el = jQuery(el);
        this.animQueue = [];
        this.animating = false;
    }

    Motion.isSupport = true;
    try{
        var p = new Path('M0 0L10 10');
        p.getAt(.5);
    }catch(e) {
        Motion.isSupport = false;
    }

    Motion.prototype.to = function(dest, timing){
        if(typeof dest === 'number') {
            dest = {offset: dest};
        }
        if(typeof timing === 'number') {
            timing = {duration:timing};
        }
        timing = jQuery.extend({}, this.defaultTiming, timing);
        timing.complete = jQuery.proxy(timing.complete || jQuery.noop, this);
        timing.step = jQuery.proxy(this.step, this);

        this.animQueue.push([dest, timing]);
        this.checkAnimQueue();
        return this;
    };

    Motion.prototype.checkAnimQueue = function(){
        if(this.animating || this.animQueue.length === 0) {
            return;
        }
        var args = this.animQueue.shift();
        this.animating = true;
        jQuery.Animation(this.options, args[0], args[1])
            .then(jQuery.proxy(function(){
                this.animating = false;
                this.checkAnimQueue();
            }, this));
    };

    Motion.prototype.defaultOptions = {
        path: '',
        offset: 0,
        rotation: 'auto'
    };

    Motion.prototype.defaultTiming = {
        duration: 1000,
        easing: 'linear'
    };

    Motion.prototype.step = function(offset){
        if(!this.path) {
            return;
        }
        var pos = this.path.getAt(offset);
        var translate = 'translate(-50%, -50%) translate(' + pos.x + 'px,' + pos.y + 'px)';
        var rotation = this.options.rotation;
        var rotate = 'rotate(' + (rotation === 'auto' ? pos.rotate : rotation) + 'deg)';
        this.el.css({
            transform: translate + ' ' + rotate
        });
    };
    return Motion;
}));
