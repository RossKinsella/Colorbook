require 'nokogiri'
require 'time'

def findUniqueColor(colors)
	potentialColor = ("%06x" % (rand * 0xf0f0f0))
	if colors.include? potentialColor
		return findUniqueColor(colors)
	else
		colors << potentialColor
	end
end

def main()
	# Get the messages xml.
	f = File.open("messages.htm")
	doc = Nokogiri::XML(f)

	# Create a collection of all the thread items
	# |- Each thread represents a conversation partnet.
	threadsXml =  doc.xpath('/html/body/div/div/div')

	# Create a collection of each conversation partner.
	partnersXml = threadsXml.xpath('text()')

	# Get the time of every message
	# |- Store the messages in a 2D array [partners][messages-of-that-partner]
	messageTimes = Array.new
	threadsXml.each_with_index { |conversationThread, index|

		# Create a temporary array for the messages with this partner.
		currentPartnerMessageTimes = Array.new
		# Get the time of every message with this partner.
		currentConversationPartnerMessageTimes = conversationThread.xpath('div/div/span[2]/text()')
		
		currentConversationPartnerMessageTimes.each do |messageTime|
			currentPartnerMessageTimes << Time.parse(messageTime)
		end
		messageTimes << currentPartnerMessageTimes
	}

	# Assign a color to every conversation partner.
	colors = Array.new
	partnersXml.each do |partner| 
		findUniqueColor(colors)
	end

	# Bring the time and partner color data together
	# |- Store this data in a CSV manner -> [datetime, user_id, color]
	messagesWithUserId = Array.new
	for i in 0..partnersXml.count-1
		messageTimes[i].each do |messageTime|
			messagesWithUserId << (messageTime.to_s << ", " << i.to_s << ", #" << colors[i])
		end
	end

	# Sort by datetime.
	messagesWithUserId = messagesWithUserId.sort

	# Write to csv.
	File.open('message_data.csv', 'w') do |f2|  
	  f2.puts "date_time, user_id, color" 
	  f2.puts messagesWithUserId
	end 

	f.close
end



main()