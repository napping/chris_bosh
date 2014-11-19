for $root in doc ("export.xml")
	return
	<tripster xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="ta_tripster.xsd">
		<operator>PGCB</operator>
		<web_url>www.pgcband.com</web_url>
		{
			for $u_tuple in $root/database/USERS/tuple
				return <user>
					<login>{$u_tuple/USERNAME/text()}</login>
					<email>{$u_tuple/EMAIL/text()}</email>
					<name>{$u_tuple/FULL_NAME/text()}</name>
					<affiliation>{$u_tuple/AFFILIATION/text()}</affiliation>
					<interests>{$u_tuple/INTERESTS/text()}</interests>
					{
						for $friend in $root/database/FRIENDSHIP/tuple
						where $friend/USERNAME1/text() = $u_tuple/USERNAME/text()
							return
								<friend>{$friend/USERNAME2/text()}</friend>,
						for $friend in $root/database/FRIENDSHIP/tuple
						where $friend/USERNAME2/text() = $u_tuple/USERNAME/text()
							return
								<friend>{$friend/USERNAME1/text()}</friend>

					}

					{

						for $owns in $root/database/OWNS/tuple
						where $owns/USERNAME/text() = $u_tuple/USERNAME/text()
						and $owns/TYPE/text() = 'Trip'
							for $trip in $root/database/TRIP/tuple
							where $trip/TID/text() = $owns/MID/text()
							return 
							<trip>
								<id>{$trip/TID/text()}</id>
								<name>{$trip/NAME/text()}</name>
								<feature> {
									   	for $hashtag in $root/database/HASHTAG/tuple
									   		for $describes in $root/database/DESCRIBES/tuple
									   		where $describes/HID/text() = $hashtag/HID/text()
									   			for $media in $root/database/MEDIA/tuple
									   			where $describes/MID/text() = $media/MID/text()
									   			and $media/TYPE/text() = 'Trip'
									   			and $trip/TID/text() = $media/MID/text()
									   				return string-join($hashtag/TAG/text(), " ")

								   } </feature>
								   {
								   		for $media in $root/database/MEDIA/tuple
								   		where $media/TYPE/text() = 'Trip'
								   		and $media/MID/text() = $trip/TID/text()
								   			return <privacyFlag>{$media/PRIVACY/text()}</privacyFlag>
								   }
								   {
								   		for $albumRelation in $root/database/ALBUMOFTRIP/tuple
								   		where $albumRelation/TID/text() = $trip/TID/text()
								   			for $album in $root/database/ALBUM/tuple
								   			where $album/AID/text() = $albumRelation/AID/text()
								   				return <album>
								   					<id>{$album/AID/text()}</id>
								   					<name>{$album/NAME/text()}</name>
								   					<privacyFlag>{$album/PRIVACY/text()}</privacyFlag>
								   					{
									   				for $inAlbum in $root/database/INALBUM/tuple
									   				where $inAlbum/AID/text() = $album/AID/text()
									   					for $media in $root/database/MEDIA/tuple
									   					where $inAlbum/MID/text() = $media/MID/text() and
									 						$media/TYPE/text() = 'Photo'
									   						for $photo in $root/database/PHOTO/tuple
									   						where $photo/PID/text() = $media/MID/text()
										   						return <content>
										   							<id>{$photo/PID/text()}</id>
										   							<source>group20</source>
										   							<type>photo</type>
										   							<url>{$photo/URL/text()}</url>
										   						</content>
								   				}
								   				{
								   				for $inAlbum in $root/database/INALBUM/tuple
									   				where $inAlbum/AID/text() = $album/AID/text()
									   					for $media in $root/database/MEDIA/tuple
									   					where $inAlbum/MID/text() = $media/MID/text() and
									 						$media/TYPE/text() = 'Video'
									   						for $video in $root/database/VIDEO/tuple
									   						where $video/VID/text() = $media/MID/text()
										   						return <content>
										   							<id>{$video/VID/text()}</id>
										   							<source>group20</source>
										   							<type>video</type>
										   							<url>{$video/URL/text()}</url>
										   						</content>
								   				}
								   				</album>
								   }
								   {
								   		for $partOf in $root/database/PARTOF/tuple
								   		where $partOf/TID/text() = $trip/TID/text()
								   			for $destination in $root/database/DESTINATION/tuple
								   			where $destination/DID/text() = $partOf/DID/text()
								   				return <location>
								   					<name>{$destination/NAME/text()}</name>
								   					<type>{$destination/TYPE/text()}</type>
								   				</location>
								   }
							</trip>
					}
					{
						for $rating in $root/database/RATING/tuple
						where $rating/TYPE/text() = 'Trip' 
						and $rating/USERNAME/text() = $u_tuple/USERNAME/text()
							return <rateTrip>
											 <tripid>{ $rating/MID/text() }</tripid>
											 <score>{ $rating/SCORE/text() }</score>
											 <comment>{ $rating/REVIEW/text() }</comment>
										 </rateTrip>
					}
					{
						for $rating in $root/database/RATING/tuple
						where $rating/TYPE/text() = 'Photo' 
						and $rating/USERNAME/text() = $u_tuple/USERNAME/text()
							return <rateContent>
											 <contentid>{ $rating/MID/text() }</contentid>
											 <contentSource>group20</contentSource>
											 <score>{ $rating/SCORE/text() }</score>
											 <comment>{ $rating/REVIEW/text() }</comment>
										 </rateContent>
					}
					{
						for $rating in $root/database/RATING/tuple
						where $rating/type/text() = 'Video' 
						and $rating/USERNAME/text() = $u_tuple/USERNAME/text()
							return <rateContent>
											 <contentid>{ $rating/MID/text() }</contentid>
											 <contentSource>group20</contentSource>
											 <score>{ $rating/SCORE/text() }</score>
											 <comment>{ $rating/REVIEW/text() }</comment>
										 </rateContent>
					}
					{
						for $request in $root/REQUESTTRIP/tuple
						where $request/USERNAME/text() = $u_tuple/USERNAME/text()
							return  <request>
												<tripid> { $request/TID/text() } </tripid>
												<status> pending </status>
										  </request>
					} 
					{
						for $invite in $root/INVITETRIP/tuple
						where $invite/USERNAME/text() = $u_tuple/USERNAME/text()
							return  <invite>
												<tripid> { $invite/TID/text() } </tripid>
												<friendid> { $invite/USERNAME2/text() } </friendid>
												<status> pending </status>
										  </invite>
					} 

				</user>
		}
	</tripster>
(: don't forget to add the trip name you idiot :)