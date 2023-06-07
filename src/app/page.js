"use client"

import { useEffect, useRef, useState } from "react"
import Map from "./map"
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url"
import { AlternativeDetails } from "./alt-details"

export default function Root() {
  const [alternatives, setAlternatives] = useState([])
  // const [locationSearchStr, setLocationSearchStr] = useState('')
  const [rankings, setRankings] = useState([])
  // const [locationCoord, setLocationCoord] = useState({})
  const [selDetailId, setSelDetailId] = useState('')
  const [c1, setC1] = useState(5)
  const [c2, setC2] = useState(5)
  const [c3, setC3] = useState(5)
  const [c4, setC4] = useState(5)
  const [c5, setC5] = useState(5)
  const [c6, setC6] = useState(5)
  const [c7, setC7] = useState(5)
  const [cOpt, setCOpt] = useState([])

  useEffect(() => {
    fetchAlternatives()
  }, [])

  const fetchAlternatives = () => {
    fetch('/api/dataset', {
      method: 'GET',
    }).then(async res => {
      const { data } = await res.json()
      setAlternatives(data)
    })
  }

  const submitInput = () => {
    fetch('/api/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        alternativeIds: alternatives.reduce((acc, alt) => {
          // if (alt.active)
          acc.push(alt.id)
          return acc
        }, []),
        criterias: [{id: 1, w: c1}, {id: 2, w: c2}, {id: 3, w: c3}, {id: 4, w: c4}, {id: 5, w: c5}, {id: 6, w: c6}, {id: 7, w: c7}],
        optCriterias: cOpt.map((c, index) => ({ id: index+8, w: c.w, loc: { lat: c.loc[0], long: c.loc[1] } }))
      })
    }).then(async res => {
      const { data } = await res.json()
      setRankings(data)
    })
  }

  //const map = useRef([])
  // const infowindow = useRef({})

  // const initMap = () => {
  //   //const initLocation = new google.maps.LatLng(-33.867, 151.195);
  //   // infowindow.current = new google.maps.InfoWindow()
  //   const initLocation = new google.maps.LatLng(-33.867, 151.195)
  //   setLocationCoord(initLocation)
  //   const map = new google.maps.Map(document.getElementById('map'), {
  //     center: initLocation,
  //     zoom: 15,
  //   })
  //   return map
  // }

  const addOptCriteria = () => {
    // const initLocation = new google.maps.LatLng(-33.867, 151.195)
    // setLocationCoord(initLocation)
    // const map = new google.maps.Map(document.getElementById('map-' + cOpt.length+1), {
    //   center: initLocation,
    //   zoom: 15,
    // })
    // setCOpt(cOpt => { cOpt.push({ w: 5, loc: {}, search: '' }); return cOpt })
    // setCOpt(() => { cOpt.push(1); return cOpt })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCOpt(cOpt => [...cOpt, { w: 5, loc: [pos.coords.latitude, pos.coords.longitude], search: '' }])
      });
    } else {
      setCOpt(cOpt => [...cOpt, { w: 5, loc: [0,0, 0.0], search: '' }])
    }
  }

  const removeOptCriteria = (index) => {
    const updatedCOpt = [...cOpt]
    updatedCOpt.splice(index, 1)
    setCOpt(updatedCOpt)
  }

  const timer = useRef({})
  const handleSearchChange = (index, searchStr) => {
    if (searchStr == '')
      return
    if (timer.current)
      clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      updateSearchOptCriteria(index, searchStr)
    }, 1500)
  }

  const updateWOptCriteria = (index, w) => {
    const updatedCOpt = [...cOpt]
    updatedCOpt[index].w = w
    setCOpt(updatedCOpt)
  }

  const updateSearchOptCriteria = (index, search) => {
    fetch(`https://geocode.maps.co/search?${new URLSearchParams({ q: search })}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      const result = await res.json()
      const updatedCOpt = [...cOpt]
      updatedCOpt[index].search = search
      updatedCOpt[index].loc = [parseFloat(result[0].lat), parseFloat(result[0].lon)]
      setCOpt(updatedCOpt)
    })
  }

  // const updateLocOptCriteria = (index, loc) => {
  //   const updatedCOpt = [...cOpt]
  //   updatedCOpt.loc = loc
  //   setCOpt(updatedCOpt)
    
  // }

  // const changeMapLocation = (index, searchStr) => {
  //   const request = {
  //     query: searchStr,
  //     fields: ['name', 'geometry'],
  //   }
  //   const service = new google.maps.places.PlacesService(map[index])
  //   service.findPlaceFromQuery(request, (results, status) => {
  //     if (status == google.maps.places.PlacesServiceStatus.OK && results) {
  //       const place = results[0]
  //       if (!place.geometry || !place.geometry.location) return;
  //         const marker = new google.maps.Marker({
  //           map: map[index],
  //           position: place.geometry.location,
  //           draggable: true
  //         });
  //         setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
  //         google.maps.event.addListener(marker, 'drag', function() {
  //           setCOpt(cOpt => { cOpt[index].loc = marker.getPosition(); return cOpt })
  //         })
  //       map[index].setCenter(place.geometry.location)
  //     }
  //   })
  // }

  return (
    <div className='flex flex-col'>
      <div className='h-[100vh] flex-1 flex flex-col'>
        <div className='px-4 pt-4 flex-1 flex flex-row divide-x-2 divide-x-gray-400'>
          <div className='p-6 w-[30%]'>
            <h1 className='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>Kriteria</h1>
            <div className='h-[65vh] px-2 overflow-y-auto'>
              <div className='mr-4 flex flex-col'>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC1(5) : setC1(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Luas Tanah</div>
                      <div className='ml-2 font-medium'>{ (c1 == 0) ? '' : c1 }</div>
                    </div>
                    { (c1 != 0) ? <input onChange={(e) => setC1(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c1 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC2(5) : setC2(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Harga</div>
                      <div className='ml-2 font-medium'>{ (c2 == 0) ? '' : c2 }</div>
                    </div>
                    { (c2 != 0) ? <input onChange={(e) => setC2(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c2 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC3(5) : setC3(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Lebar Jalan</div>
                      <div className='ml-2 font-medium'>{ (c3 == 0) ? '' : c3 }</div>
                    </div>
                    { (c3 != 0) ? <input onChange={(e) => setC3(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c3 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC4(5) : setC4(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>  
                      <div className='flex-1 font-medium text-sm text-gray-600'>Jarak ke Pusat Kota</div>
                      <div className='ml-2 font-medium'>{ (c4 == 0) ? '' : c4 }</div>
                    </div>
                    { (c4 != 0) ? <input onChange={(e) => setC4(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c4 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC5(5) : setC5(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Jarak Layanan Pendidikan Terdekat</div>
                      <div className='ml-2 font-medium'>{ (c5 == 0) ? '' : c5 }</div>
                    </div>
                    { (c5 != 0) ? <input onChange={(e) => setC5(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c5 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC6(5) : setC6(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Jarak Layanan Kesehatan Terdekat</div>
                      <div className='ml-2 font-medium'>{ (c6 == 0) ? '' : c6 }</div>
                    </div>
                    { (c6 != 0) ? <input onChange={(e) => setC6(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c6 } /> : ''}
                  </div>
                </div>
                <div className='my-2 flex flex-row'>
                  <div className='w-6'>
                    <input className='mx-auto' type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setC7(5) : setC7(0)} />
                  </div>
                  <div className='flex-1 flex flex-col'>
                    <div className='mb-2 flex flex-row'>
                      <div className='flex-1 font-medium text-sm text-gray-600'>Jarak ke Pusat Perbelanjaan</div>
                      <div className='ml-2 font-medium'>{ (c7 == 0) ? '' : c7 }</div>
                    </div>
                    { (c7 != 0) ? <input onChange={(e) => setC7(e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c7 } /> : ''}
                  </div>
                </div>
                {
                  (cOpt && cOpt.length > 0) ? cOpt.map((c, index) => {
                    return (
                      <div key={index} className='my-2 flex flex-row'>
                        <div className='w-6'>
                          <i class='fa-solid fa-circle-minus cursor-pointer text-gray-400 hover:text-red-400' onClick={() => removeOptCriteria(index)}></i>
                        </div>
                        <div className='flex-1 flex flex-col'>
                          <div className='mb-3 flex flex-row'>
                            <div className='flex-1 font-medium text-sm text-gray-600'>Lokasi Custom { index+1 }</div>
                            <div className='font-medium text-sm'>{ c.w }</div>
                          </div>
                          <input onChange={(e) => updateWOptCriteria(index, e.target.value)} className='w-full h-[5px]' type='range' min='1' max='10' defaultValue={ c.w } />
                          <div className='my-2 flex flex-row'>
                            <input type='text' className='mt-1 w-full px-3 py-1 border border-gray-400 rounded-md outline-0 text-sm text-gray-700' onChange={(e) => handleSearchChange(index, e.target.value)} placeholder='Cari lokasi...' />
                          </div>
                          {/* <Map mapId={index} searchStr={c.search} cb={(loc) => updateLocOptCriteria(index, loc)} /> */}
                          {/* <div className='w-full h-48' id={`map-${index+1}`}></div> */}
                          <iframe className='w-full' style={{ border: 0 }} loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?${new URLSearchParams({key: 'AIzaSyAE3GLfP8CVF2eG8W34hy-O4Y1hlM0GVWw', q: c.loc[0]+','+c.loc[1] })}`}></iframe>
                        </div>
                      </div>
                    )
                  }) : ''
                }
              </div>
            </div>
            <div className='my-2 ml-auto'>
              <button onClick={() => addOptCriteria()} className='w-fit px-3 py-2 bg-blue-600 text-gray-100 rounded-md'>Tambah Kriteria Lokasi</button>
            </div>
          </div>
          <div className='w-[30%] p-6 flex flex-col'>
            <h1 className='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>Alternatif</h1>
            <div className='my-2 h-[65vh] overflow-y-auto'>
              <div className='mr-4 flex flex-col'>
                {
                  (alternatives && alternatives.length > 0) ? alternatives.map((alt) => {
                    return (
                      <div key={alt.id} onClick={() => setSelDetailId(alt.id)} className='my-2 px-4 py-4 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl cursor-pointer'>
                        <img src={alt.urlFoto ? alt.urlFoto : '#'} className='w-[40%] mr-4 aspect-[4/3] object-cover' alt='Alternative Image'/>
                        <div className='flex-1 flex flex-col'>
                          <div className='my-1 font-medium'>{ alt.nama }</div>
                          <div className='my-1 font-medium text-gray-500 text-sm'>{ alt.luas } m<sup>2</sup></div>
                          <div className='my-1 font-medium text-gray-500 text-sm'>Rp { alt.harga }/m<sup>2</sup></div>
                        </div>
                      </div>
                    )
                  }) : ''
                }
              </div>
            </div>
          </div>
          <div className='p-6 flex-1 flex flex-col'>
            <h1 className='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>Detail Alternatif</h1>
            <AlternativeDetails alternatives={alternatives} selDetailId={selDetailId} />
            {/* <div className='mt-auto ml-auto mr-8 w-fit'>
              <button onClick={() => submitInput() } className='px-4 py-2 bg-blue-600 text-lg text-gray-100 rounded-md'>Submit</button>
            </div> */}
          </div>
        </div>
        <div className='my-2 flex-1'>
          <div className='ml-auto mr-8 w-fit'>
            <button onClick={() => submitInput() } className='px-4 py-2 bg-blue-600 text-lg text-gray-100 rounded-md'>Generate</button>
          </div>
        </div>
      </div>
      {
        (rankings && rankings.length > 0) ? 
        <div className='mt-8 mb-2 flex-1 flex flex-col'>
          <h1 className='mb-8 mx-auto text-gray-800 font-semibold text-4xl'>Hasil Ranking</h1>
          <div className='my-2 h-[80vh] overflow-y-auto'>
            <div className='flex flex-col mx-auto w-[60%]'>
              {
                rankings.map((rankId, index) => {
                  const alt = alternatives.find((alt) => alt.id == rankId.id)
                  alt.score = rankId.score
                  return (
                    <div key={alt.id} className='my-2 px-14 py-6 w-full flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                      <div className='m-auto w-16'>
                        <div className='m-auto text-5xl font-semibold text-gray-700'>{ index + 1 }</div>
                      </div>
                      <img src={alt.urlFoto ? alt.urlFoto : '#'} className='w-[40%] mr-4 aspect-[3/2] object-cover' alt='Alternative Image'/>
                      <div className='my-auto ml-4 flex-1 flex flex-col'>
                        <div className='my-2 font-medium text-2xl'>{ alt.nama }</div>
                        <div className='my-2 font-medium text-gray-500 text-lg'>{ alt.luas } m<sup>2</sup></div>
                        <div className='my-2 font-medium text-gray-700 text-lg'>Rp { alt.harga }/m<sup>2</sup></div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div> : ''
      }
    </div>
  )
}