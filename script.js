// Atividade 1 - Calendário de feriados com a BrasilAPI
// Aluno(a): Bruno Loschi

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// TODO 1: preencher o campo com o ano atual
campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    total.innerHTML = ''
    proximo.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            // TODO 2: se resposta.ok for false, lança um erro
            if (!resposta.ok) {
                throw new Error(`Ano inválido: "${ano}". A API não retornou feriados para ele.`)
            }
            return resposta.json()
        })
        .then(feriados => {
            // TODO 3: total de feriados
            total.innerHTML = `Total de feriados em ${ano}: <strong>${feriados.length}</strong>`

            // Desafio extra: próximo feriado a partir de hoje
            const hoje = new Date()
            hoje.setHours(12, 0, 0, 0)
            let achado = null
            let diasFaltando = 0

            feriados.forEach(feriado => {
                // O 'T12:00:00' evita erro de fuso horario
                const data = new Date(feriado.date + 'T12:00:00')

                // TODO 4: data no padrão brasileiro
                const dataBR = data.toLocaleDateString('pt-BR')

                // TODO 5: dia da semana
                const diaSemana = data.getDay()

                // TODO 6: classe para sábado/domingo
                const classe = (diaSemana === 0 || diaSemana === 6) ? 'fim-de-semana' : ''

                tabela.innerHTML += `
                    <tr class="${classe}">
                        <td>${dataBR}</td>
                        <td>${diasDaSemana[diaSemana]}</td>
                        <td>${feriado.name}</td>
                    </tr>`

                // a lista vem em ordem cronológica: o primeiro >= hoje é o próximo
                if (!achado && data >= hoje) {
                    achado = feriado
                    diasFaltando = Math.round((data - hoje) / (1000 * 60 * 60 * 24))
                }
            })

            if (achado) {
                const dataBR = new Date(achado.date + 'T12:00:00').toLocaleDateString('pt-BR')
                const texto = diasFaltando === 0
                    ? 'é hoje!'
                    : diasFaltando === 1 ? 'falta 1 dia' : `faltam ${diasFaltando} dias`
                proximo.innerHTML = `Próximo feriado: <strong>${achado.name}</strong> (${dataBR}) — ${texto}`
                proximo.classList.add('destaque')
            } else {
                proximo.classList.remove('destaque')
            }
        })
        .catch(erro => {
            // TODO 7: mostra o erro na página
            proximo.classList.remove('destaque')
            mensagem.innerHTML = `<span class="erro">${erro.message}</span>`
            console.log(erro)
        })
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)

// consulta o ano atual ao abrir a página
consultarFeriados()
