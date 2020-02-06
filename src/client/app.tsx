import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
} from 'react-share';
import { GoogleMap, Marker, MarkerClusterer, useLoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';

import GitHubButton from 'react-github-btn'
import useFetch from 'use-http';

const options = {
  // zoomControlOptions: {
  //   position: google.maps.ControlPosition.RIGHT_CENTER // ,
  // }
}

const url = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    // googleMapsApiKey: process.env.GOOGLE_API_KEY
  })
  const { loading, data } = useFetch(url, [])
  const [center, setCenter] = useState({ lat: 25.0391667, lng: 121.525 })
  const [current, setCurrent] = useState(null)

  if (loadError) {
    return <div>
      Map cannot be loaded right now, sorry.
    </div>
  }

  if (!isLoaded || loading) {
    return <div>
      loading...
    </div>
  }

  const facilities = data.features.map(x => ({
    id: x.properties.id,
    name: x.properties.name,
    phone: x.properties.phone,
    address: x.properties.address,
    latitude: x.geometry.coordinates[1],
    longitude: x.geometry.coordinates[0],
    adultMask: x.properties.mask_adult,
    childMask: x.properties.mask_child,
    updated: x.properties.updated,
  }))

  return <div className='main-container'>
    <div className='header'>
      <FacebookShareButton url={window.location.href}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <LineShareButton url={window.location.href}>
        <LineIcon size={32} round />
      </LineShareButton>
      <GitHubButton href="https://github.com/jackypan1989" aria-label="Follow @jackypan1989 on GitHub">Follow Author</GitHubButton>
      {current ? <div>
        <div>
          <span className='info'>機構: {current.name}</span>
          <span className='info'>成人口罩: {current.adultMask}</span>
          <span className='info'>小孩口罩: {current.childMask}</span>
        </div>
        <div>
          <span className='info'>地址: {current.address}</span>
          <span className='info'>電話: {current.phone}</span>
          <span className='info'>更新時間: {current.updated}</span>
        </div>
      </div> : <div>
          請選擇地圖座標 (先按確定)
      </div>}
    </div>
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        flex: 1
      }}
      id='google-map'
      options={options}
      zoom={14}
      center={center}
    >
      <MarkerClusterer
        options={options}
        calculator={(markers) => {
          const number = markers.reduce(
            (pre, cur) => pre + parseInt(cur.getLabel().text),
            0
          )

          return {
            index: Math.round(number / 100),
            text: number.toString(),
            title: ''
          }
        }}
      >
        {
          (clusterer) => facilities.map((facility, i) => (
            <Marker
              title={facility.id.toString()}
              key={i}
              position={{ lat: facility.latitude, lng: facility.longitude }}
              clusterer={clusterer}
              label={{
                color: 'white',
                text: (facility.adultMask + facility.childMask).toString()
              }}
              onClick={() => {
                setCurrent(facility)
                setCenter({ lat: facility.latitude, lng: facility.longitude })
              }}
            />
          ))
        }
      </MarkerClusterer>
    </GoogleMap>

  </div>


}

export default App;