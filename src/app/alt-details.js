import { useEffect, useState } from "react"

export function AlternativeDetails({ alternatives, selDetailId }) {
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (!alternatives || !selDetailId)
      return
    const findAlt = alternatives.find((alt) => alt.id == selDetailId)
    if (findAlt)
      getAddressByCoord(findAlt.lokasi)
  }, [alternatives, selDetailId])

  const getAddressByCoord = async (coord) => {
    const res = await fetch(`https://geocode.maps.co/reverse?${new URLSearchParams({ lat: coord.lat, lon: coord.long })}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const result = await res.json()
    setAddress(result.display_name)
  }

  return (
    <>
    { (selDetailId) ? alternatives.filter((alt) => alt.id == selDetailId).map((alt, index) => {
      return (
        <div key={index}>
          <div className='flex flex-row'>
            <img src={alt.urlFoto} className='max-w-[50%] my-2 aspect-[4/3] object-cover' alt='Image Detail' />
            <iframe className='max-w-[50%]' style={{ border: 0 }} loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?${new URLSearchParams({ key: 'AIzaSyAE3GLfP8CVF2eG8W34hy-O4Y1hlM0GVWw', q: alt.lokasi ? (alt.lokasi.lat + ',' + alt.lokasi.long) : 'Jakarta, Indonesia' })}`}></iframe>
          </div>
          <div className='my-2 flex flex-col'>
            <div className='text-sm font-medium text-gray-600'><i className="fa-solid fa-location-dot text-red-500"></i>&nbsp;&nbsp; {address}</div>
          </div>
          <div className='my-4'>
            <div className='flex flex-row'>
              <div className='flex-1 flex flex-col'>
                <div className='font-semibold text-lg'>{alt.nama}</div>
                <div className='flex-1 text-gray-600 font-medium'>Rp {alt.harga}/m<sup>2</sup></div>
              </div>
              <div className='flex-1 flex flex-col'>
                <div className='mt-3 font-semibold text-gray-600 text-sm'>Luas Tanah</div>
                <div className='font-medium text-gray-800'>{alt.luas} m<sup>2</sup></div>
              </div>
            </div>
            <div className='mt-4 flex flex-row'>
              <div className='flex-1 flex flex-col'>
                <div className='flex flex-col'>
                  <div className='font-semibold text-gray-600 text-sm'>Lebar Jalan</div>
                  <div className='font-semibold text-gray-800'>{alt.lebar} m</div>
                </div>
                <div className='mt-2 flex flex-col'>
                  <div className='font-semibold text-gray-600 text-sm'>Jarak ke Pusat Kota</div>
                  <div className='font-semibold text-gray-800'>{alt.kota} km</div>
                </div>
                <div className='mt-2 flex flex-col'>
                  <div className='font-semibold text-gray-600 text-sm'>Layanan Pendidikan Terdekat</div>
                  <div className='font-semibold text-gray-800'>{alt.pendidikan} km</div>
                </div>
              </div>
              <div className='flex-1 flex flex-col'>
                <div className='flex flex-col'>
                  <div className='font-semibold text-gray-600 text-sm'>Layanan Kesehatan Terdekat</div>
                  <div className='font-semibold text-gray-800'>{alt.kesehatan} km</div>
                </div>
                <div className='mt-2 flex flex-col'>
                  <div className='font-semibold text-gray-600 text-sm'>Pusat Perbelanjaan Terdekat</div>
                  <div className='font-semibold text-gray-800'>{alt.perbelanjaan} km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }) : <div className='mt-2 text-gray-500 text-sm tracking-wider italic'>Pilih detail alternatif untuk ditampilkan</div>
    }
    </>
  )
}