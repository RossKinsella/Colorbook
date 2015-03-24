
$(document).ready(function() {
    // Globals
    States = {pageIsActive: true, tappedInfoButton: false};
    InteractionIndex = {datetime: 0, user_id: 1, color: 2};
    ClockElements = { year: $('#year'), month: $('#month'), day: $('#day'), hour: $('#hour'), minute: $('#minute')};
    Variables = { interactionFrequency: 15, minInteractionSize: 10, maxInteractionSize: 30 }
    Interactions = new Queue();
    
    // Events

    $('.info').on('tap', function(){ 
        // console.log(States.tappedInfoButton);
        if (States.tappedInfoButton)
        {
            $('#more-info').stop( true, true ).fadeOut( 400 ); 
            $('.info').removeClass('show');
            // console.log($('.info').attr("class").split(' '));
            States.tappedInfoButton  = false;
        }
        else{
            $('#more-info').stop( true, true ).fadeIn( "slow" ); 
            $('.info').addClass('show');
            // console.log($('.info').attr("class").split(' '));
            States.tappedInfoButton  = true;            
        }
    });


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
        Papa.parse("data/message_data.csv", {
            download: true,
            complete: function(results) {
                // Add every interaction to a Queue
                for (var i= 1; i < results.data.length - 1; i++)
                {
                        QueueInteraction((results.data[i]));     
                }
                // Start the main logic.
                $('#loader-container').fadeOut( "slow" );
                $('#clock').fadeIn( "slow" );
                $('.info').fadeIn( "slow" );
                $('#song').get(0).play();
                

                Main();
            }
        }); 
    }

    function Main()
    {
        // Infinite loop
        window.setInterval(function () {
            if (States.pageIsActive && !Interactions.isEmpty())
            {
                // Dequeue an interaction and activate it
                var interaction = Interactions.dequeue();
                ActivateInteraction(interaction);
            }
            else
            {
                // console.log('Paused');
            }
        }, Variables.interactionFrequency); // repeat forever, polling every 0.1 seconds
    }

    function ActivateInteraction(interaction)
    {
        // Update the time
        datetime = interaction.datetime;
        UpdateTimer(datetime);

        // Get animation properties
        var color = "background:" + interaction.color + ";";
        var sizeInt = getRandomInt(Variables.minInteractionSize, Variables.maxInteractionSize);
        var size = "height: " + sizeInt + "px; width: " + sizeInt + "px;";
        var topOffset = "top: " + getRandomInt(0,100) + "%;"; 
        var style = topOffset+color+size;

        // Create the animation with a self destruct
        $("<div class='interaction-ball' style='" + style + "'></div>").appendTo('#interaction-container').one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){$(this).remove();});
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

        var randomX = 0;
        var randomY = 0;
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

    function getRandomInt(min, max) {
     return Math.round(Math.random() * (max - min + 1)) + min;
    }  

});