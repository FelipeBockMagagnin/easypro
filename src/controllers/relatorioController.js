exports.post = (req, res, next) => {
    let data = req.body;
    let html_base = '<style>td{ text-align: center;}</style><div><div><b>Nome do arquivo:</b>{name} <br /><br /><b>Data:</b> {date} <b>Hora:</b> {hour} <br /><br />{metadata}</div></div>';
    let html = '';

    const keys = data.project.vid_list;

    console.log(keys);
    keys.forEach(key_vid => {
        let date = new Date();
        let html_metadata = '';
        let time_total = 0;

        const file = data.file[key_vid];

        html += html_base;
        html = html.replace('{name}', file.fname)
        html = html.replace('{date}', date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear())
        html = html.replace('{hour}', date.getHours() + ':' + date.getMinutes() + 'h')

        let lastItem = '';
        Object.entries(data.metadata).forEach(entry => {
            const [key, value] = entry;

            if (value.vid === key_vid) {
                if (value.av[1]) {

                    if (lastItem != '' && lastItem !== value.av[1]) {
                        html_metadata += '</tbody></table><br/>';
                    }

                    console.log(lastItem, value.av[1], value)
                    if (lastItem != '' && lastItem === value.av[1]) {
                        html_metadata += '<tr><td>' + parseFloat(value.z[0]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1]).toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1] - value.z[0]).toFixed(5) + '</td></tr>'
                        html_metadata += '</tbody></table><br/>';
                    } else {
                        html_metadata += '<h2 style="margin: 0;">' + value.av[1] + '</h2>'
                        html_metadata += '<table style="width: 400px;"><thead><tr><td>TEMPO INICIAL</td><td>TEMPO FINAL</td><td>TOTAL</td></tr></thead><tbody>';
                        html_metadata += '<tr><td>' + value.z[0].toFixed(5) + '</td>' + '<td>' + value.z[1].toFixed(5) + '</td>' + '<td>' + parseFloat(value.z[1] - value.z[0]).toFixed(5) + '</td></tr>'
                    }

                    lastItem = value.av[1];
                    time_total += (value.z[1] - value.z[0]);
                }
            }
        })

        html_metadata += '</tbody></table><br/>';
        html_metadata += '<b>TOTAL OPERAÇÃO:</b> ' + time_total.toFixed(5) + '<br/>';
        html_metadata += '<b>TOTAL PADRÃO:</b> ' + (time_total / 60).toFixed(5) + '<br/>';
        html_metadata += '<b>TOTAL OPERAÇÃO:</b> ' + (528 / (time_total / 60)).toFixed(5) + '<br/>';
        html_metadata += '<hr/><br/>';

        html_metadata += '<div style="page-break-after: always;"></div>'
        html = html.replace('{metadata}', html_metadata)

    });

    res.status(200).send(html);
};
