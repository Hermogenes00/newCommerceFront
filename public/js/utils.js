window.onload = event => {
    
    $('.money').mask('000.000.000.000.000,000', { reverse: true })

    //Add eventListener Keyup in the selected inputs
    let inputs = document.querySelectorAll('input')
    for (item in inputs) {
        switch (inputs[item].name) {            
            case 'tamFinalAltura':
            case 'tamFinalLargura':
            case 'tamSangriaAltura':
            case 'tamSangriaLargura':
            case 'peso':
            case 'gramatura':
            case 'largura':
                inputs[item].addEventListener('keyup', (event) => {
                    if (event.target.value) {
                        let valorFormatado = formatReal(event)
                        event.target.value = valorFormatado
                    }
                })
                break;
        }
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function getMoney(str) {
    return parseInt(str.replace(/[\D]+/g, ''));
}


function formatReal(event) {
    let valor = getMoney(event.target.value)
    var tmp = valor + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
        tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    //take the number without dot and comma, for validation as number
    let convertNumber = tmp.replace('.', '').replace(',', '')
    return isNaN(convertNumber) ? 0 : tmp
}
