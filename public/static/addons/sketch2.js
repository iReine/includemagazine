//import React, { Component } from 'react';

// var P5Wrapper = require('react-p5-wrapper');

// <P5Wrapper sketch={sketch} />

var sketch = function (p) {

    // sw = strokeWeight

    var x=50, y=50, cellSz, grid=[], widthCan = 400, heightCan = 400;
    var DOWN=1, RIGHT=2, px=0, py=0, sw=2;

    var gui;

    p.setup = function () {

        p.createCanvas(widthCan,heightCan);

        p.background(255);
        p.noFill();
        p.strokeWeight(sw); 
        p.strokeCap(p.PROJECT);

        p.makeGrid();
        p.foreach(p.drawCell);

        p.step();

        // // Create the GUI
        // p.sliderRange(0, 90, 1);
        // gui = p.createGui('p5.gui');
        // gui.addGlobals('sw', 'x', 'y');
      
        // // Only call draw when then gui is changed
        // p.noLoop();

        /**** GUI ****/
        var params = {
            interation: 5000
        };
        var gui = new dat.gui({
            height : 5 * 32 - 1
        });


    }


    p.drawCell = function (j,i) {

        // skip one row/col around edge
        if (i > 0 && j < y-1 && i < y-1 && i < x-1 && j < x-1) {
       
            var off = 0;
            p.stroke(0);
            if (!p.exists(j, i, DOWN)) { 
                p.stroke(255); // erase
                if (j > 1) off = sw;
            }

            if (j  > 0) {

                p.line(j * cellSz + off, cellSz + i * cellSz, // horiz 
                        (j + 1) * cellSz-1, cellSz + i * cellSz);
            } 

            off = 0;
            p.stroke(0);
            if (!p.exists(j, i, RIGHT)) {
                p.stroke(255); // erase
                if (i > 1) off = sw;
            }

            p.line((cellSz + j * cellSz), i * cellSz + off, // vert 
                    (cellSz + j * cellSz), (i + 1) * cellSz);   
        }
    }

    p.makeGrid = function () {

        cellSz = p.min(p.width,p.height) / x;

        for (var j = 0; j < x+1; j++) { 

            grid[j] = []; // initialize to 0 
            for (var i = 0; i < y+1; i++) 
                grid[j][i] = 0;
        }
    }

    p.step = function () {

        var dirs = (Math.random() < .9)  ? [DOWN] : [RIGHT,DOWN];
        var idx = p.floor(p.random(dirs.length));
        var dir = dirs[idx];
        p.remove_sketch(px, py, dir);

        // but weight verticals and the diagonal
        var d = p.dist(px,0,py,0) / x;
        if (Math.random()  < d) 
            p.remove_sketch(px, py, RIGHT);

        p.drawCell(px,py); 

        if (++px % x == 0) { px = 0; ++py; } 

        if (py < y-1 || px < x-1) 
            p.step();
    }

    p.foreach = function (fun) {

        for (var i = 0; i < y; i++) { 
            for (var j = 0; j < x; j++)  
                fun.apply(this,[j,i]);
        }   
    }

    p.exists = function (j,i,side) {

        switch(side) {
            case RIGHT: return (grid[j][i] < 2);
            case DOWN:  return (grid[j][i] % 2==0);
        }
    }

    p.remove_sketch = function (j,i,side) {

        if (p.exists(j,i,side)) 
            grid[j][i] += side;
    }
};

new p5(sketch, 'container');