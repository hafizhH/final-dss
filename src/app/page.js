"use client"

import { useEffect, useState } from "react"

export default function Root() {
  const [alternatives, setAlternatives] = useState([])
  const [c1, setC1] = useState(5)
  const [c2, setC2] = useState(5)
  const [c3, setC3] = useState(5)
  const [c4, setC4] = useState(5)
  const [c5, setC5] = useState(5)
  const [c6, setC6] = useState(5)
  const [c7, setC7] = useState(5)
  const [c8, setC8] = useState(5)

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

  return (
    <div class='flex flex-col'>
      <div class='px-8 pt-8 flex-1 flex flex-row divide-x-2 divide-x-gray-400'>
        <div class='p-6 w-60'>
          <h1 class='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>1. Kriteria</h1>
          <div class='flex flex-col'>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Luas Tanah</div>
                <div class='font-medium text-sm'>{ c1 }</div>
              </div>
              <input onChange={(e) => setC1(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c1 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Harga</div>
                <div class='font-medium text-sm'>{ c2 }</div>
              </div>
              <input onChange={(e) => setC2(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c2 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Lebar Jalan</div>
                <div class='font-medium text-sm'>{ c3 }</div>
              </div>
              <input onChange={(e) => setC3(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c3 } />
            </div>
            <div class='my-2 mt-8 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Jarak ke Pusat Kota</div>
                <div class='font-medium text-sm'>{ c4 }</div>
              </div>
              <input onChange={(e) => setC4(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c4 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Jarak Layanan Pendidikan Terdekat</div>
                <div class='font-medium text-sm'>{ c5 }</div>
              </div>
              <input onChange={(e) => setC5(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c5 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Jarak Layanan Kesehatan Terdekat</div>
                <div class='font-medium text-sm'>{ c6 }</div>
              </div>
              <input onChange={(e) => setC6(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c6 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Jarak ke Pusat Perbelanjaan</div>
                <div class='font-medium text-sm'>{ c7 }</div>
              </div>
              <input onChange={(e) => setC7(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c7 } />
            </div>
            <div class='my-2 flex-col'>
              <div class='flex flex-row'>
                <div class='flex-1 font-medium text-sm text-gray-600'>Jarak ke Tempat Kerja</div>
                <div class='font-medium text-sm'>{ c8 }</div>
              </div>
              <input onChange={(e) => setC8(e.target.value)} class='w-full h-[7px]' type='range' min='1' max='10' defaultValue={ c8 } />
            </div>
          </div>
        </div>
        <div class='p-6 h-full flex-1 flex flex-col'>
          <h1 class='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>2. Alternatif</h1>
          <div class='my-2 h-[70vh] overflow-y-auto'>
            <div class='flex flex-col'>
              {
                (alternatives && alternatives.length > 0) ? alternatives.map((alt, index) => {
                  return (
                    <div class='my-2 px-4 py-4 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                      <img src={alt.urlFoto ? alt.urlFoto : '#'} class='h-full w-[50%] mr-2' alt='Alternative Image' style={{ objectFit: 'cover' }}/>
                      <div class='flex-1 flex flex-col'>
                        <div class='my-1 font-medium'>{ alt.nama }</div>
                        <div class='my-1 font-medium text-gray-500 text-sm'>{ alt.luas } m<sup>2</sup></div>
                        <div class='my-1 font-medium text-gray-500 text-sm'>Rp { alt.harga }/m<sup>2</sup></div>
                      </div>
                    </div>
                  )
                }) : ''
              }
{/*               
              <div class='my-2 px-4 py-2 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                <img src='#' class='h-full' alt='Alternative Image'/>
                <div class='flex-1 flex flex-col'>
                  <div class='my-1 font-medium'>Lorem Ipsum</div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>150 m<sup>2</sup></div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>Rp 1.000.000/m<sup>2</sup></div>
                </div>
              </div>
              <div class='my-2 px-4 py-2 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                <img src='#' class='h-full' alt='Alternative Image'/>
                <div class='flex-1 flex flex-col'>
                  <div class='my-1 font-medium'>Lorem Ipsum</div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>150 m<sup>2</sup></div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>Rp 1.000.000/m<sup>2</sup></div>
                </div>
              </div>
              <div class='my-2 px-4 py-2 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                <img src='#' class='h-full' alt='Alternative Image'/>
                <div class='flex-1 flex flex-col'>
                  <div class='my-1 font-medium'>Lorem Ipsum</div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>150 m<sup>2</sup></div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>Rp 1.000.000/m<sup>2</sup></div>
                </div>
              </div>
              <div class='my-2 px-4 py-2 h-32 flex flex-row border border-gray-300 rounded-lg shadow-xl'>
                <img src='#' class='h-full' alt='Alternative Image'/>
                <div class='flex-1 flex flex-col'>
                  <div class='my-1 font-medium'>Lorem Ipsum</div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>150 m<sup>2</sup></div>
                  <div class='my-1 font-medium text-gray-500 text-sm'>Rp 1.000.000/m<sup>2</sup></div>
                </div>
              </div> */}
            </div>
          </div>
          <div class='my-2 ml-auto'>
            <button class='w-fit px-3 py-2 bg-blue-600 text-gray-100 rounded-md'>Tambah Alternatif</button>
          </div>
        </div>
        <div class='p-6 flex-1 flex flex-col'>
          <h1 class='mb-4 mx-2 text-gray-800 font-semibold text-3xl'>3. Hasil</h1>

          {/* <img src='' class='w-full my-2' alt='Image Detail'/>
          <div class='my-2'>
            <div class='font-semibold text-lg'>Lorem Ipsum</div>
            <div class='flex flex-row'>
              <div class='flex-1 text-gray-600 font-medium'>Rp 1.000.000/m<sup>2</sup></div>
              <div class='font-medium text-gray-600'>150 m<sup>2</sup></div>
            </div>
          </div>
          <div class='my-2 flex flex-col'>
            <div class='text-sm font-medium text-gray-600'><i class="fa-solid fa-location-dot text-red-500"></i>&nbsp;&nbsp; Jl. Margo Siswo, Mejing, Lor, Gamping, Sleman</div>
          </div> */}
        </div>
      </div>
      <div class='my-2'>
        <div class='ml-auto mr-8 w-fit'>
          <button class='px-4 py-2 bg-blue-600 text-lg text-gray-100 rounded-md'>Submit</button>
        </div>
      </div>
    </div>
  )
}
