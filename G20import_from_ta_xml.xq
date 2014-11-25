declare namespace functx = "http://www.functx.com";
declare function functx:index-of-node
  ( $nodes as node()* ,
    $nodeToFind as node() )  as xs:integer* {

  for $seq in (1 to count($nodes))
  return $seq[$nodes[$seq] is $nodeToFind]
 } ;

for $root in doc("project_data.xml")
  return <database>
    <USERS> {
      for $user in $root/tripster/user
      return
        <tuple>
          <USERNAME>{$user/login/text()}</USERNAME>
          <PASSWORD>default</PASSWORD>
          <EMAIL>{$user/email/text()}</EMAIL>
          <FULL_NAME>{$user/name/text()}</FULL_NAME>
          <AFFILIATION>{$user/affiliation/text()}</AFFILIATION>
          <INTERESTS>{$user/interests/text()}</INTERESTS>
        </tuple>
    } </USERS>

    <MEDIA> {
      for $trip in $root/tripster/user/trip
        return
          <tuple>
            <MID>{$trip/id/text()}</MID>
            <TYPE>Trip</TYPE>
            <PRIVACY>{$trip/privacyFlag/text()}</PRIVACY>
            <SOURCE>{$trip/album/content[1]/source/text()}</SOURCE>
          </tuple>,
      for $destination at $i in $root/tripster/user/trip/location
        return
          <tuple>
            <MID>{$i}</MID>
            <TYPE>Destination</TYPE>
            <PRIVACY>public</PRIVACY>
            <SOURCE>{$destination/../album/content[1]/source/text()}</SOURCE>
          </tuple>,
      for $trip in $root/tripster/user/trip
        for $album in $trip/album
          for $content in $album/content
            return
              <tuple>
                <MID>{$content/id/text()}</MID>
                <TYPE>{if ($content/type/text() = "photo") then "Photo" else "Video"}</TYPE>
                <PRIVACY>public</PRIVACY>
                <SOURCE>{$content/source/text()}</SOURCE>
              </tuple>
    }</MEDIA>

    <DESTINATION>{
      for $destination at $i in $root/tripster/user/trip/location
        return
          <tuple>
            <DID>{$i}</DID>
            <NAME>{$destination/name/text()}</NAME>
            <TYPE>Destination</TYPE>
            <SOURCE>{$destination/../album/content[1]/source/text()}</SOURCE>
          </tuple>
    }</DESTINATION>

    <TRIP>{
      for $trip in $root/tripster/user/trip
        return
          <tuple>
            <TID>{$trip/id/text()}</TID>
            <NAME>{$trip/name/text()}</NAME>
            <SOURCE>{$trip/album/content[1]/source/text()}</SOURCE>
          </tuple>
    }</TRIP>

    <OWNS>{
      for $user in $root/tripster/user
        for $trip in $user/trip
          return
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <MID>{$trip/id/text()}</MID>
              <TYPE>Trip</TYPE>
              <SOURCE>{$trip/album/content[1]/source/text()}</SOURCE>
            </tuple>,
      for $user in $root/tripster/user
        for $trip in $user/trip
          for $album in $trip/album
            for $content in $album/content
              return
                <tuple>
                  <USERNAME>{$user/login/text()}</USERNAME>
                  <MID>{$content/id/text()}</MID>
                  <TYPE>{if ($content/type/text() = "photo") then "Photo" else "Video"}</TYPE>
                  <SOURCE>{$content/source/text()}</SOURCE>
                </tuple>
    }</OWNS>

    <PARTOF>{
      for $destination at $i in $root/tripster/user/trip/location
        return
          <tuple>
            <TID>{$destination/../id/text()}</TID>
            <DID>{$i}</DID>
            <ORDER_IN_TRIP>{functx:index-of-node($destination/../location, $destination)}</ORDER_IN_TRIP>
            <SOURCE>{$destination/../album/content[1]/source/text()}</SOURCE>
          </tuple>
    }</PARTOF>

    <ALBUM>{
      for $album in $root/tripster/user/trip/album
        return
          <tuple>
            <AID>{$album/id/text()}</AID>
            <NAME>{$album/name/text()}</NAME>
            <PRIVACY>{$album/privacyFlag/text()}</PRIVACY>
            <SOURCE>{$album/content[1]/source/text()}</SOURCE>
          </tuple>
    }</ALBUM>

    <ALBUMOFTRIP>{
      for $trip in $root/tripster/user/trip
        for $album in $trip/album
          return
            <tuple>
              <AID>{$album/id/text()}</AID>
              <TID>{$trip/id/text()}</TID>
              <SOURCE>{$album/content[1]/source/text()}</SOURCE>
            </tuple>
    }</ALBUMOFTRIP>

    <PHOTO>{
      for $photo in $root/tripster/user/trip/album/content
        return if ($photo/type/text() = 'photo') then
          <tuple>
            <PID>{$photo/id/text()}</PID>
            <URL>{$photo/url/text()}</URL>
            <TYPE>Photo</TYPE>
            <SOURCE>{$photo/source/text()}</SOURCE>
          </tuple>
          else ''
    }</PHOTO>

    <INALBUM>{
      for $album in $root/tripster/user/trip/album
        for $content in $album/content
          return
            <tuple>
              <AID>{$album/id/text()}</AID>
              <MID>{$content/id/text()}</MID>
              <TYPE>{if ($content/type/text() = "photo") then "Photo" else "Video"}</TYPE>
              <SOURCE>{$content/source/text()}</SOURCE>
            </tuple>
    }</INALBUM>

    <FRIENDSHIP>{
      for $user in $root/tripster/user
        for $friend in $user/friend
          return
            <tuple>
              <USERNAME1>{$user/login/text()}</USERNAME1>
              <USERNAME2>{$friend/text()}</USERNAME2>
            </tuple>
    }</FRIENDSHIP>

    <HASHTAG>{
      for $feature in $root/tripster/user/trip/feature
        for $hashtag in tokenize($feature/text(), '\s')
          return
            <tuple>
              <TAG>{$hashtag}</TAG>
            </tuple>
    }</HASHTAG>

    <DESCRIBES>{
      for $trip in $root/tripster/user/trip
        for $feature in $trip/feature
          for $hashtag in tokenize($feature/text(), '\s')
            return
              <tuple>
                <TAG>{$hashtag}</TAG>
                <MID>{$trip/id/text()}</MID>
                <TYPE>Trip</TYPE>
                <SOURCE>{$trip/album/content[1]/source/text()}</SOURCE>
              </tuple>
    }</DESCRIBES>

    <RATING>{
      for $user in $root/tripster/user
        for $rating in $user/rateTrip
          return
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <RATING>{$rating/score/text()}</RATING>
              <MID>{$rating/tripid/text()}</MID>
              <TYPE>Trip</TYPE>
              <REVIEW>{$rating/comment/text()}</REVIEW>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>,
      for $user in $root/tripster/user
        for $rating in $user/rateContent
          return
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <RATING>{$rating/score/text()}</RATING>
              <MID>{$rating/contentid/text()}</MID>
              <TYPE>Photo</TYPE>
              <REVIEW>{$rating/comment/text()}</REVIEW>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>,
      (: Duplicating photo and video since we can't disambiguate the type here. :)
      for $user in $root/tripster/user
        for $rating in $user/rateContent
          return
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <RATING>{$rating/score/text()}</RATING>
              <MID>{$rating/contentid/text()}</MID>
              <TYPE>Video</TYPE>
              <REVIEW>{$rating/comment/text()}</REVIEW>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>
    }</RATING>

    <REQUESTTRIP>{
      for $user in $root/tripster/user
        for $request in $user/request
          return if ($request/status/text() = 'pending') then
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <TID>{$request/tripid/text()}</TID>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>
          else ''
    }</REQUESTTRIP>

    <INVITETRIP>{
      for $user in $root/tripster/user
        for $invite in $user/invite
          return if ($invite/status/text() = 'pending') then
            <tuple>
              <USERNAME1>{$user/login/text()}</USERNAME1>
              <USERNAME2>{$invite/friendid/text()}</USERNAME2>
              <TID>{$invite/tripid/text()}</TID>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>
          else ''
    }</INVITETRIP>

    <VIDEO>{
      for $video in $root/tripster/user/trip/album/content
        return if ($video/type/text() = 'video') then
          <tuple>
            <VID>{$video/id/text()}</VID>
            <URL>{$video/url/text()}</URL>
            <TYPE>Video</TYPE>
            <SOURCE>{$video/source/text()}</SOURCE>
          </tuple>
          else ''
    }</VIDEO>

    <GOESON>{
      for $user in $root/tripster/user
        for $request in $user/request
          return if ($request/status/text() = 'accepted') then
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <TID>{$request/tripid/text()}</TID>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>
          else '',
      for $user in $root/tripster/user
        for $invite in $user/invite
          return if ($invite/status/text() = 'accepted') then
            <tuple>
              <USERNAME>{$invite/friendid/text()}</USERNAME>
              <TID>{$invite/tripid/text()}</TID>
              <SOURCE>{$user/trip/album/content[1]/source/text()}</SOURCE>
            </tuple>
          else ''
    }</GOESON>

    <NOTIFIEDOF></NOTIFIEDOF>

    <LINK></LINK>

    <NOTIFICATION></NOTIFICATION>
  </database>