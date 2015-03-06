
$(document).ready(function() {
    states = {pageIsActive: 4};
    

    $(window).blur(function(){
        states.pageIsActive = false;
        console.log('blur');
    });

    $(window).focus(function(event) {
       states.pageIsActive = true;
       console.log('focus');
    });


    // Make the canvas full screen via js rather than css to avoid pixelation.
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var mainContext = canvas.getContext('2d');

    var interactions = new Queue();

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;


    function Interaction(radius, speed, width, xPos, yPos, color) {
        this.radius = radius;
        this.speed = speed;
        this.width = width;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.opacity = .05 + Math.random() * .5;
    }

    Interaction.prototype.update = function() {

        mainContext.beginPath();

        // pixels / second
        this.xPos += this.speed;


        mainContext.arc(this.xPos,
            this.yPos,
            10,
            0,
            Math.PI * 2,
            false);

        mainContext.closePath();

        mainContext.fillStyle = this.color
        mainContext.fill();
        if (this.xPos < (canvas.width + this.width)) {
            interactions.enqueue(this);
        }
    };

    function addInteraction(color) {

        var randomX = -10;
        var randomY = Math.round(-200 + Math.random() * canvas.height + 200);
        var speed = 7;
        var size = 5 + Math.random() * 100;

        var interaction = new Interaction(10, speed, size, randomX, randomY, color);

        interactions.enqueue(interaction);


    }


        draw();
    
        

    function draw() {
        console.log(states.pageIsActive);
        if (states.pageIsActive)
        {
            mainContext.clearRect(0, 0, canvas.width, canvas.height);


            for (var i = 0; i < interactions.getLength(); i++) {


                var interaction = interactions.dequeue();
                interaction.update();

            }
        }

            requestAnimationFrame(draw);
    }


    var count = 0;
    var curr = 1;
    var time = 100;

    var datetime;
    var yearElement = $('#year');
    var monthElement = $('#month');
    var dayElement = $('#day');
    var hourElement = $('#hour');
    var minuteElement = $('#minute');


    Papa.parse("data/message_data.csv", {
        download: true,
        complete: function(results) {

            for (var i= 0; i < results.data.length; i++)
            {
                if (states.pageIsActive)
                {
                    setTimeout(function () {
                        datetime = results.data[curr][0];
                        
                        yearElement.text(datetime.substr(0, 4));
                        monthElement.text(datetime.substr(5, 2));
                        dayElement.text(datetime.substr(8, 2));
                        hourElement.text(datetime.substr(11, 2));
                        minuteElement.text(datetime.substr(14, 2));

                        addInteraction((results.data[curr][2]));
                        curr++;
                    }, time);

                    time += 10;
                }
            }
        }
    });
});