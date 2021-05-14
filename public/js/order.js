
function showItems(event) {


    document.getElementById('numPedido').innerHTML = event.target.dataset.id
    let status = document.getElementById('status')
    let informe = document.getElementById('informe')

    //Tabela do modal
    let tbItensOrder = document.getElementById('tbItensOrder')

    axios.get(`/admin/cart/itensCart/` + event.target.dataset.id).then(response => {
        tbItensOrder.innerHTML = ''
        let dados = response.data
        dados.forEach(item => {

            //Info about the order
            let date = new Date(item.pedido.createdOrder)


            document.getElementById('emissao').innerHTML = `<h6>Emissão: <small class="text-muted"> ${date.toLocaleDateString()}</small> </h6>`
            document.getElementById('totalPedido').innerHTML = `<h6>Total do Pedido:<small class="text-muted"> ${parseFloat(item.pedido.valorFinal).toLocaleString('pt-br', { style: 'currency', currency: 'brl' })}</small></h6>`
            document.getElementById('valorFrete').innerHTML = `<h6>Frete:<small class="text-muted"> ${parseFloat(item.pedido.valorFrete).toLocaleString('pt-br', { style: 'currency', currency: 'brl' })}</small></h6>`
            document.getElementById('valorPago').innerHTML = `<h6>Valor Pago:<small class="text-muted"> ${item.pedido.pagamento.status == 'RECEBIDO' ? parseFloat(item.pedido.pagamento.total).toLocaleString('ptb', { style: 'currency', currency: 'brl' }) : 'R$ 0,00'} </small></h6>`
            document.getElementById('situacaoFinanceira').innerHTML = `<h6>Situação Financeira: <small class="text-muted">${item.pedido.pagamento ? item.pedido.pagamento.status : '---'}</small> </h6>`
            document.getElementById('tipoEntrega').innerHTML = `<h6>Tipo de Entrega: <small class="text-muted"> ${item.pedido.metodoEnvio}</small> </h6>`

            //Info about the delivery address
            if (item.pedido.metodoEnvio == 'BALCAO') {
                let datePrevisaoEntrega3Day = new Date(item.pedido.createdOrder)
                datePrevisaoEntrega3Day.setDate(date.getDate() + 3)

                document.getElementById('localEntrega').innerHTML = 'Endereço de Entrega: Retirar na empresa'
                document.getElementById('previsaoEntrega').innerHTML = `<h6>Previsão de Entrega: <small class="text-muted"> ${datePrevisaoEntrega3Day.toLocaleDateString()}</small> </h6>`
            } else if (item.pedido.metodoEnvio == 'PAC_VISTA' || item.pedido.metodoEnvio == 'SEDEX_VISTA') {

                let datePrevisaoEntrega8Day = new Date(item.pedido.createdOrder)
                datePrevisaoEntrega8Day.setDate(date.getDate() + 8)

                let datePrevisaoEntrega28Day = new Date(item.pedido.createdOrder)
                datePrevisaoEntrega28Day.setDate(date.getDate() + 28)

                document.getElementById('previsaoEntrega').innerHTML = `<h6>Previsão de Entrega: <small class="text-muted"> ${datePrevisaoEntrega8Day.toLocaleDateString()} à ${datePrevisaoEntrega28Day.toLocaleDateString()} </small> </h6>`
                document.getElementById('localEntrega').innerHTML = `<h6>Endereço de Entrega: <small class="text-muted">${item.pedido.endereco.bairro}, ${item.pedido.endereco.numero}, ${item.pedido.endereco.cep},${item.pedido.endereco.cidade}/${item.pedido.endereco.uf}</small></h6>`

            } else {
                let datePrevisaoEntrega15Day = new Date(item.pedido.createdOrder)
                datePrevisaoEntrega15Day.setDate(date.getDate() + 15)
                document.getElementById('previsaoEntrega').innerHTML = `<h6>Previsão de Entrega: <small class="text-muted"> ${datePrevisaoEntrega15Day.toLocaleDateString()}</small> </h6>`
                //document.getElementById('localEntrega').innerHTML = `<h6>Endereço de Entrega:  <small class="text-muted">${item.pedido.regiaoEntrega.rua}, ${item.pedido.regiaoEntrega.numero},${item.pedido.regiaoEntrega.bairro}, ${item.pedido.regiaoEntrega.cep},${item.pedido.regiaoEntrega.cidade}/${item.pedido.regiaoEntrega.uf}</small></h6>`
            }



            let linkBaixarArquivo = item.arquivo ? `    
                <a href="/uploads/${item.arquivo}">Baixar Arquivo</a>
                `: ''

            tbItensOrder.innerHTML += `
                                    <tr>
                                        <td>${item.id}</td>
                                        <td>${item.produto.nome}</td>
                                        <td>${item.status ? item.status : '---'}</td>
                                        <td>${parseFloat(item.valor).toLocaleString('pt-br', { style: 'currency', currency: 'brl' })}</td>
                                   
                                   
                                        <td>${item.qtd}</td>
                                                                       
                                        <td>${item.altura ? item.altura : '---'}</td>
                                        <td>${item.largura ? item.largura : '---'}</td>
                                   
                                        <td>${item.produto.codRef}</td>
                                   
                                        <td>${linkBaixarArquivo}</td>
    
                                    </tr>
                                    ${item.status == 'REFUGADO' || item.status == 'ARQUIVO_VAZIO' ? `
                                    <tr><td colspan="9"> 
                                    
                                    <div class="row">
    
                                    <div class="col"><input type="file" class="form-control form-control-sm" id="arquivo"  name="arquivo" placeholder="Envie o seu arquivo corrigido"></div>
                                    <div class ="col"><button onClick="enviarArquivo(event)" data-idItem="${item.id}" class="btn btn-primary btn-sm">Enviar Arquivo para análise</button></div>
                                    <div class ="col invisible" id="progressFile"></div>
                                    </div>
                                    </td></tr>`
                    : ''}
                `

        })
    }).catch(err => {

    })

    requisicao('/payment/byOrder/' + event.target.dataset.id, (response => {
        let dados = JSON.parse(response)

        status.value = dados.status
        informe.value = dados.informe
    }))

}

function remover(event, form, msg) {
    event.preventDefault();
    Swal.fire({
        title: 'Confirmação',
        text: msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            form.submit()
        }
    })
}

function verificaTamanhoArquivo(event, form) {
    event.preventDefault()
    file = form.children[0]

    let byteToMb = parseFloat(file.files[0].size) * 0.000001;
    if (byteToMb > 100) {
        Swal.fire('Arquivo não pode ser maior que 100MB')
    } else {
        form.submit()
    }
}

function cancelarPedido(event, msg, form) {
    event.preventDefault()
    Swal.fire({
        title: 'Confirmação',
        text: msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            form.submit()
        }
    })
}

function buscarCep() {

    let cep = document.getElementById('cep');

    document.getElementById('btnCep').addEventListener('click', (event) => {
        buscarCep(cep.value, response => {
            objResponse = JSON.parse(response)
            document.getElementById('rua').value = objResponse.logradouro
            document.getElementById('bairro').value = objResponse.bairro
            document.getElementById('complemento').value = objResponse.complemento
        });
    })
}


function filtrar() {

    let dateStart = document.getElementById('dateStart')
    let dateFinish = document.getElementById('dateFinish')
    let status = document.getElementById('selectStatus')
    //take function CONSTANTS from file js/constants.js
    if (status.value && dateStart.value && dateFinish.value) {
        window.location.href = `http://localhost:${CONSTANTS().PORT}/client/orders/${dateStart.value}/${dateFinish.value}/${status.value}`
    }


}