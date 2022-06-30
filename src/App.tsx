import {useState} from 'react'

import axios from "axios";
import {jsPDF} from 'jspdf'
import {toPng} from 'html-to-image'

function App() {

    const [token, setToken] = useState("")
    const [storeName, setStoreName] = useState("")
    const [filename, setFilename] = useState("")


    const [downloadList, setDownloadList] = useState([])

    const BASE_URL = "https://master-api-gw-west2-20220623-02-9p2ox35r.wl.gateway.dev"

    async function fetchDownloadList() {
        const {data} = await axios.get(BASE_URL + `/v2/exports/`, {
            params: {store_name: storeName}, headers: {
                authorization: `Bearer ${token}`
            }
        })
        setDownloadList(data.files)
    }

    function exportPDFAndUpload() {
        const element = document.getElementById('exported-element') as HTMLDivElement;

        toPng(element).then((dataUrl) => {
            const pdf = new jsPDF();

            pdf.addImage(dataUrl, 'PNG', 15, 5, 180, 0, '', 'MEDIUM');

            pdf.save(filename)

            const blob = pdf.output('blob');

            const file = new FormData();
            file.append('file', blob);


            axios.post(BASE_URL + `/v2/exports/${filename}`, file,
                {
                    params: {
                        store_name: storeName,
                    },
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            ).then()

        })

    }

    return (
        <div className="mx-auto max-w-lg mt-10">
            <div className="grid grid-cols-12" id="exported-element">

                <div className="col-span-8">
                    <div className=" ">

                        <p className="text-lg font-bold">Token</p>
                        <textarea className="border" value={token}
                                  onChange={(e) => setToken(e.target.value)}/>
                        <p className="text-lg font-bold">Store name</p>
                        <input type="text" className="border" value={storeName}
                               onChange={(e) => setStoreName(e.target.value)}/>

                        <p className="text-lg font-bold">file name</p>
                        <input type="text" className="border" value={filename}
                               onChange={(e) => setFilename(e.target.value)}/>
                    </div>

                    <div>
                        this is a test for exporting / uploading

                        <button className="border text-white bg-blue-500" onClick={exportPDFAndUpload}>Export
                            PDF</button>
                    </div>
                </div>


                <div className="border col-span-4">
                    <p>Download list</p>
                    <button className="border text-white bg-blue-500" onClick={fetchDownloadList}>Refresh list</button>

                    <pre>{JSON.stringify(downloadList, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}

export default App