
$(document).ready(function() {
    states = {pageIsActive: 4, interaction_frequency: 20, current_time: 0};
    InteractionIndex = {datetime: 0, user_id: 1, color: 2};
    var interactions = new Queue();
    

    $(window).blur(function(){
        states.pageIsActive = false;
    });

    $(window).focus(function(event) {
       states.pageIsActive = true;
    });

    var time = 100;

    function Main()
    {
        // Infinite loop
        window.setInterval(function () {
            if (states.pageIsActive)
            {
                // Dequeue an interaction and activate it
                var interaction = interactions.dequeue();
                ActivateInteraction(interaction);
            }
            else
            {
                console.log('Paused');
            }
        }, 100); // repeat forever, polling every 0.1 seconds
    }

    function ActivateInteraction(interaction)
    {
        // Update the time
        datetime = interaction.datetime;
        //console.log(datetime);
        
        yearElement.text(datetime.substr(0, 4));
        monthElement.text(datetime.substr(5, 2));
        dayElement.text(datetime.substr(8, 2));
        hourElement.text(datetime.substr(11, 2));
        minuteElement.text(datetime.substr(14, 2));  
    }


    function Interaction(radius, speed, width, xPos, yPos, datetime, user_id, color) {
        this.radius = radius;
        this.speed = speed;
        this.width = width;
        this.xPos = xPos;
        this.yPos = yPos;
        this.datetime = datetime;
        this.user_id = user_id;
        this.color = color;
        this.opacity = .05 + Math.random() * .5;
    }

    function addInteraction(interaction_data) {

        var randomX = -10;
        var randomY = Math.round(-200 + Math.random() * canvas.height + 200);
        var speed = 7;
        var size = 5 + Math.random() * 100;

        var interaction = new Interaction(
            10,
            speed,
            size,
            randomX,
            randomY,
            interaction_data[InteractionIndex.datetime],
            interaction_data[InteractionIndex.user_id],
            interaction_data[InteractionIndex.color]
        );
        
        interactions.enqueue(interaction);

    }    

    var count = 0;
    var curr = 1;


    var datetime;
    var yearElement = $('#year');
    var monthElement = $('#month');
    var dayElement = $('#day');
    var hourElement = $('#hour');
    var minuteElement = $('#minute');

    // Parse the data.
    Papa.parse("data/testing_message_data.csv", {
        download: true,
        complete: function(results) {
            // Add every interaction to a Queue
            for (var i= 0; i < results.data.length - 1; i++)
            {
                    addInteraction((results.data[curr]));
                    curr++;
            }
            // Start the main logic.
            Main();
        }
    });
});