
$(document).ready(function() {
    // Globals
    States = {pageIsActive: true};
    InteractionIndex = {datetime: 0, user_id: 1, color: 2};
    ClockElements = { year: $('#year'), month: $('#month'), day: $('#day'), hour: $('#hour'), minute: $('#minute')};
    Variables = { interactionFrequency: 100 }
    Interactions = new Queue();

    Initialise();

    function Initialise()
    {
        // Pause state event listeners
        $(window).blur(function(){
            States.pageIsActive = false;
        });

        $(window).focus(function(event) {
           States.pageIsActive = true;
        });

        // Parse the data.
        Papa.parse("data/testing_message_data.csv", {
            download: true,
            complete: function(results) {
                // Add every interaction to a Queue
                var curr = 1;
                for (var i= 0; i < results.data.length - 1; i++)
                {
                        QueueInteraction((results.data[curr]));
                        curr++;
                }
                // Start the main logic.
                Main();
            }
        }); 
    }

    function Main()
    {
        // Infinite loop
        window.setInterval(function () {
            if (States.pageIsActive)
            {
                // Dequeue an interaction and activate it
                var interaction = Interactions.dequeue();
                ActivateInteraction(interaction);
            }
            else
            {
                console.log('Paused');
            }
        }, Variables.interactionFrequency); // repeat forever, polling every 0.1 seconds
    }

    function ActivateInteraction(interaction)
    {
        // Update the time
        datetime = interaction.datetime;
        UpdateTimer(datetime);

        // Create the animation

    }

    function UpdateTimer(datetime)
    {
        ClockElements.year.text(datetime.substr(0, 4));
        ClockElements.month.text(datetime.substr(5, 2));
        ClockElements.day.text(datetime.substr(8, 2));
        ClockElements.hour.text(datetime.substr(11, 2));
        ClockElements.minute.text(datetime.substr(14, 2));        
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

    function QueueInteraction(interaction_data) {

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
        
        Interactions.enqueue(interaction);
    }    

});