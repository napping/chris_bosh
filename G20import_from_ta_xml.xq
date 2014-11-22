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
          </tuple>,
      for $trip in $root/tripster/user/trip
        for $destination at $i in $trip/location
          return
            <tuple>
              <MID>{$i}</MID>
              <TYPE>Destination</TYPE>
              <PRIVACY>public</PRIVACY>
            </tuple>,
      for $trip in $root/tripster/user/trip
        for $album in $trip/album
          for $content in $album/content
            return
              <tuple>
                <MID>{$content/id/text()}</MID>
                <TYPE>{if ($content/type/text() = "photo") then "Photo" else "Video"}</TYPE>
                <PRIVACY>public</PRIVACY>
              </tuple>
    }</MEDIA>

    <DESTINATION>{
      for $trip in $root/tripster/user/trip
        for $destination at $i in $trip/location
          return
            <tuple>
              <DID>{$i}</DID>
              <NAME>{$destination/name/text()}</NAME>
              <TYPE>{$destination/type/text()}</TYPE>
            </tuple>
    }</DESTINATION>

    <TRIP>{
      for $trip in $root/tripster/user/trip
        return
          <tuple>
            <TID>{$trip/id/text()}</TID>
            <NAME>{$trip/name/text()}</NAME>
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
                </tuple>
    }</OWNS>

    <PARTOF>{
      for $trip in $root/tripster/user/trip
        for $destination at $i in $trip/location
          return
            <tuple>
              <TID>{$trip/id/text()}</TID>
              <DID>{$i}</DID>
              <ORDER_IN_TRIP>{$i}</ORDER_IN_TRIP>
            </tuple>
    }</PARTOF>

    <ALBUM>{
      for $album in $root/tripster/user/trip/album
        return
          <tuple>
            <AID>{$album/id/text()}</AID>
            <NAME>{$album/name/text()}</NAME>
            <PRIVACY>{$album/privacyFlag/text()}</PRIVACY>
          </tuple>
    }</ALBUM>

    <ALBUMOFTRIP>{
      for $trip in $root/tripster/user/trip
        for $album in $trip/album
          return
            <tuple>
              <AID>{$album/id/text()}</AID>
              <TID>{$trip/id/text()}</TID>
            </tuple>
    }</ALBUMOFTRIP>

    <PHOTO>{
      for $photo in $root/tripster/user/trip/album/content
        return if ($photo/type/text() = 'photo') then
          <tuple>
            <PID>{$photo/id/text()}</PID>
            <URL>{$photo/url/text()}</URL>
            <TYPE>Photo</TYPE>
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
            </tuple>
    }</RATING>

    <REQUESTTRIP>{
      for $user in $root/tripster/user
        for $request in $user/request
          return if ($request/status/text() = 'pending') then
            <tuple>
              <USERNAME>{$user/login/text()}</USERNAME>
              <TID>{$request/tripid/text()}</TID>
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
            </tuple>
          else '',
      for $user in $root/tripster/user
        for $invite in $user/invite
          return if ($invite/status/text() = 'accepted') then
            <tuple>
              <USERNAME>{$invite/friendid/text()}</USERNAME>
              <TID>{$invite/tripid/text()}</TID>
            </tuple>
          else ''
    }</GOESON>

    <NOTIFIEDOF></NOTIFIEDOF>

    <LINK></LINK>

    <NOTIFICATION></NOTIFICATION>
  </database>