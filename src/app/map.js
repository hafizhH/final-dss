"use client"

const { useEffect, useRef, useLayoutEffect, useState } = require("react")
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFmaXpoaCIsImEiOiJjbGlpdW1neDMwMXN1M2hva3JpdXVlYmVrIn0.rjUaxc8HGaruE18CGa2t-w'



export default function Map({ mapId, searchStr, coord, cb }) {

  const map = useRef({})
  const nthRender = useRef(0)
  useLayoutEffect(() => {
    if (nthRender.current <= 2)
      nthRender.current++
    if (nthRender.current != 2)
      return
    // console.log('Init Map', mapId)
    const initLocation = [-33.867, 151.195]
    let map = new mapboxgl.Map({
      container: 'map-'+mapId,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initLocation,
      zoom: 15
    })
    // map.current = new google.maps.Map(document.getElementById('map-' + mapId), {
    //   center: initLocation,
    //   zoom: 15,
    // })
  })

  useEffect(() => {
    // changeMapLocationBySearch(searchStr)
  }, [searchStr])

  useEffect(() => {
    // changeMapLocationByCoord(coord)
  }, [coord])

  const changeMapLocationByCoord = (coord) => {
    if (Object.keys(map.current) == 0)
      return
    // const marker = new google.maps.Marker({
    //   map: map.current,
    //   position: coord,
    //   draggable: true
    // })
    const marker = new mapboxgl.Marker().setLngLat([30.5, 50.5]).addTo(map)
    cb(marker.getPosition())
    // setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
    google.maps.event.addListener(marker, 'drag', function() {
      cb(marker.getPosition())
      // setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
    })
    console.log('DEBUG', map.current)
    map.current.setCenter(coord)
  }

  const changeMapLocationBySearch = (searchStr) => {
    if (Object.keys(map.current) == 0)
      return
    const request = {
      query: searchStr,
      fields: ['name', 'geometry'],
    }
    const service = new google.maps.places.PlacesService(map.current)
    service.findPlaceFromQuery(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK && results) {
        const place = results[0]
        if (!place.geometry || !place.geometry.location) return;
          const marker = new google.maps.Marker({
            map: map.current,
            position: place.geometry.location,
            draggable: true
          })
          cb(marker.getPosition())
          // setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
          google.maps.event.addListener(marker, 'drag', function() {
            cb(marker.getPosition())
            // setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
          })
        map.current.setCenter(place.geometry.location)
      }
    })
  }

  return (
    <div className='w-full h-48' id={`map-${mapId}`}></div>
  )
}