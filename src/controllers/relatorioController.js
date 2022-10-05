exports.post = (req, res, next) => {
    let data = req.body;
    let html_base = '<style>@page { size: auto;  margin: 0mm; } td{ text-align: center;}</style><div><div><h2 style="margin-bottom: 5px">Estudo Preliminar</h2><b>Nome do arquivo:</b>{name} <br /><br /><b>Data:</b> {date} <b>Hora:</b> {hour} <br /><br />{metadata}</div></div>';
    let html = '';

    const keys = data.project.vid_list;
    ciclosPorItem = {};
    totalPorItem = {};

    keys.forEach(key_vid => {
        let date = new Date();
        let html_metadata = '';
        let time_total = 0;

        const file = data.file[key_vid];

        html += html_base;
        html = html.replace('{name}', file.fname)
        html = html.replace('{date}', date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear())
        html = html.replace('{hour}', date.getHours() + ':' + date.getMinutes() + 'h')


        //calculo tempo medio

        let lastItem = '';
        Object.entries(data.metadata).forEach(entry => {
            const [key, value] = entry;

            if (value.vid === key_vid) {
                if (value.av[1]) {

                    if (lastItem != '' && lastItem !== value.av[1]) {
                        //html_metadata += '</tbody></table><br/>';
                    }

                    if (lastItem != '' && lastItem === value.av[1]) {
                       // html_metadata += '<tr><td>' + parseFloat(value.z[0]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1] - value.z[0]).toFixed(5) + '</td></tr>'
                    } else {
                        //html_metadata += '<h2 style="margin: 0;">' + value.av[1] + '</h2>'
                        //html_metadata += '<table style="width: 400px;"><thead><tr><td>TEMPO INICIAL</td><td>TEMPO FINAL</td><td>TOTAL</td></tr></thead><tbody>';
                        //html_metadata += '<tr><td>' + value.z[0].toFixed(5) + '</td>' + '<td>' + value.z[1].toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1] - value.z[0]).toFixed(5) + '</td></tr>'
                    }

                    ciclosPorItem[value.av[1]] = ciclosPorItem[value.av[1]] != undefined ? ciclosPorItem[value.av[1]] + 1 : 1

                    lastItem = value.av[1];
                    time_total += (value.z[1] - value.z[0]);

                    totalPorItem[value.av[1]] = totalPorItem[value.av[1]] != undefined ? parseFloat(totalPorItem[value.av[1]]) + parseFloat(value.z[1] - value.z[0]) : parseFloat(value.z[1] - value.z[0]);

                    //console.log('time total: ' + time_total.toFixed(5) + ', somando ' + (value.z[1] - value.z[0]).toFixed(5) + ' inicial ' + value.z[0] + ' final ' + value.z[1] + ', item ' + value.av[1]) ;
                } else {
                    console.log('error');
                }
            }
        })


        let tempo_medio_total = 0;
        //calculos media
        Object.keys(ciclosPorItem).map(x => {
            const ciclos = ciclosPorItem[x];
            const valor =  totalPorItem[x];

            console.log('ciclo' + x);
            console.log('valor' + valor);
            console.log('ciclos' + ciclos);


            //if (lastItem != '' && lastItem !== value.av[1]) {
            //}

            html_metadata += '<h2 style="margin: 0;">' + x + '</h2>'
            html_metadata += '<table style="width: 800px;"><thead><tr><td>NÚMERO DE CICLOS</td><td>SUB TEMPO TOTAL</td><td>TEMPO MÉDIO</td><td>TEMPO MÉDIO POR UNIDADE</td></tr></thead><tbody>';
            html_metadata += '<tr><td>' + ciclos + '</td>' + '<td>' + valor.toFixed(5) + '</td>' + '<td>' + parseFloat(valor / ciclos).toFixed(5) + '</td>' + '<td>' + parseFloat(valor / ciclos / 60).toFixed(5) + '</td></tr>'
            html_metadata += '</tbody></table><br/>';


            //if (lastItem != '' && lastItem === value.av[1]) {
            //    html_metadata += '<tr><td>' + parseFloat(value.z[0]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1] - value.z[0]).toFixed(5) + '</td></tr>'
            //} else {
             //   }


            let tempo_medio = valor / ciclos / 60;

            tempo_medio_total += tempo_medio;
            console.log(x, ciclos, valor)
        })

        console.log(ciclosPorItem, totalPorItem);
        html_metadata += '</tbody></table><br/>';
        html_metadata += '<b>TOTAL OPERAÇÃO:</b> ' + time_total.toFixed(5) + '<br/>';
        html_metadata += '<b>TOTAL PADRÃO:</b> ' + tempo_medio_total.toFixed(5) + '<br/>';
        html_metadata += '<b>TOTAL OPERAÇÃO:</b> ' + (528 / tempo_medio_total).toFixed(5) + '<br/>';
        html_metadata += '<hr/><br/>';

        html_metadata += '<div style="page-break-after: always;"></div>'
        html = html.replace('{metadata}', html_metadata)

    });

    res.status(200).send(html);
};
