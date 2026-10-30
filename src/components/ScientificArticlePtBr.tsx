import React from 'react'

export const ScientificArticlePtBr: React.FC = () => {
  return (
    <article className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm overflow-hidden shadow-lg text-[#ecf7d8]">
      <div className="bg-[#4a752c] px-5 py-4 text-white">
        <h1 className="font-display text-xl sm:text-2xl font-bold">
          Snake + FlyWire: Conectando computação e neurociência
        </h1>
        <p className="text-xs sm:text-sm text-[#e3f2c9] mt-1">
          <strong>Autor:</strong> Eduardo Andrade da Silva Lima
        </p>
      </div>

      <div className="p-5 space-y-6 text-sm leading-relaxed">
        {/* 1. Sobre o projeto */}
        <section className="space-y-2.5">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            1. Sobre o projeto
          </h2>
          <p>
            A ideia desse projeto surgiu da curiosidade de entender melhor como o funcionamento de um cérebro poderia ser utilizado dentro de um sistema computacional.
          </p>
          <p>
            Conheci o FlyWire e achei interessante a possibilidade de trabalhar com um mapeamento real de conexões neuronais, em vez de utilizar apenas uma rede neural criada do zero.
          </p>
          <p>
            A partir disso, resolvi experimentar uma integração entre o FlyWire e o Snake, utilizando uma estrutura inspirada nas conexões neurais da mosca-da-fruta para controlar o comportamento da cobrinha.
          </p>
          <p>
            O objetivo é observar como essas conexões podem ser utilizadas para processar informações do ambiente e gerar decisões, transformando algo que normalmente é estudado na neurociência em uma aplicação prática de programação.
          </p>
        </section>

        {/* 2. O que estou tentando desenvolver */}
        <section className="space-y-2.5 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            2. O que estou tentando desenvolver
          </h2>
          <p>
            A proposta é fazer com que o agente consiga interpretar o ambiente do jogo e decidir seus próximos movimentos a partir do processamento dos estímulos recebidos.
          </p>
          <p>Algumas das informações utilizadas são:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#e3f2c9]">
            <li>Posição da comida.</li>
            <li>Distância das paredes.</li>
            <li>Proximidade do próprio corpo.</li>
            <li>Possibilidades de movimentação.</li>
          </ul>
          <p>
            Essas informações precisam chegar ao sistema neural de alguma forma, ser processadas e depois convertidas em ações dentro do jogo.
          </p>
          <p>
            O que mais me interessa é entender como essa transformação acontece e quais comportamentos podem surgir a partir da estrutura utilizada.
          </p>
        </section>

        {/* 3. Como funciona a integração */}
        <section className="space-y-3 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            3. Como funciona a integração
          </h2>
          <p>O projeto envolve três partes principais:</p>

          <div className="space-y-3 pl-2">
            <div>
              <h3 className="font-display font-semibold text-white">
                3.1. Ambiente do jogo
              </h3>
              <p className="mt-1">
                O Snake é responsável por fornecer as informações do ambiente e executar as ações recebidas.
              </p>
              <p className="mt-1">
                Ele funciona como uma espécie de ambiente de teste, no qual consigo observar diretamente o resultado das decisões tomadas pelo sistema.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white">
                3.2. Estrutura neural
              </h3>
              <p className="mt-1">Essa é a parte mais interessante do projeto.</p>
              <p className="mt-1">
                A intenção é utilizar informações do conectoma FlyWire para construir uma estrutura de processamento baseada nas conexões entre neurônios.
              </p>
              <p className="mt-1">
                Em vez de simplesmente definir que a cobrinha deve virar para determinado lado quando encontrar um obstáculo, a ideia é fazer com que os estímulos passem por essa estrutura e influenciem as respostas produzidas.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white">
                3.3. Comunicação entre os sistemas
              </h3>
              <p className="mt-1">
                Depois do processamento neural, as respostas precisam ser interpretadas pelo jogo.
              </p>
              <p className="mt-1">
                Essa integração é importante porque não basta ter uma simulação neural funcionando isoladamente. É necessário conseguir transformar suas respostas em ações reais dentro do ambiente.
              </p>
            </div>
          </div>
        </section>

        {/* 4. O que quero investigar */}
        <section className="space-y-2.5 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            4. O que quero investigar
          </h2>
          <p>
            Mais do que conseguir uma cobrinha que jogue sozinha, quero entender algumas questões durante o desenvolvimento:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#e3f2c9]">
            <li>Como as conexões neuronais influenciam o comportamento produzido?</li>
            <li>Quais estímulos têm maior influência nas decisões?</li>
            <li>É possível obter comportamentos interessantes sem programar diretamente cada movimento?</li>
            <li>Como diferentes configurações da estrutura neural alteram os resultados?</li>
            <li>Qual é a diferença entre esse tipo de abordagem e uma IA convencional desenvolvida para jogar Snake?</li>
          </ul>
          <p>
            Essas perguntas também ajudam a definir os experimentos que pretendo realizar.
          </p>
        </section>

        {/* 5. Testes e resultados */}
        <section className="space-y-3 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            5. Testes e resultados
          </h2>
          <p>
            Para avaliar o funcionamento do projeto, pretendo realizar partidas em diferentes condições e observar os resultados.
          </p>
          <p>Algumas métricas que considero importantes:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#4a752c] text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#203612] text-[#aad751]">
                  <th className="border border-[#4a752c] px-3 py-2 font-semibold">
                    Métrica
                  </th>
                  <th className="border border-[#4a752c] px-3 py-2 font-semibold">
                    O que quero observar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4a752c]">
                <tr>
                  <td className="border border-[#4a752c] px-3 py-2 font-medium text-white">
                    Pontuação
                  </td>
                  <td className="border border-[#4a752c] px-3 py-2">
                    Quantos pontos o agente consegue alcançar
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#4a752c] px-3 py-2 font-medium text-white">
                    Sobrevivência
                  </td>
                  <td className="border border-[#4a752c] px-3 py-2">
                    Quanto tempo consegue permanecer no jogo
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#4a752c] px-3 py-2 font-medium text-white">
                    Colisões
                  </td>
                  <td className="border border-[#4a752c] px-3 py-2">
                    Quantas vezes acaba atingindo obstáculos
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#4a752c] px-3 py-2 font-medium text-white">
                    Movimentos
                  </td>
                  <td className="border border-[#4a752c] px-3 py-2">
                    Quantas ações realiza durante uma partida
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#4a752c] px-3 py-2 font-medium text-white">
                    Consistência
                  </td>
                  <td className="border border-[#4a752c] px-3 py-2">
                    Se consegue repetir bons resultados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Também pretendo comparar os resultados com uma abordagem convencional de inteligência artificial.
          </p>
          <p>
            Assim, consigo ter uma referência para entender se a estrutura neural realmente apresenta diferenças interessantes em relação a outros métodos.
          </p>
          <p>
            Os resultados serão documentados conforme os experimentos forem realizados.
          </p>
        </section>

        {/* 6. Limitações e observações */}
        <section className="space-y-2.5 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            6. Limitações e observações
          </h2>
          <p>
            Uma coisa importante é não confundir uma simulação baseada em conexões biológicas com a reprodução completa de um cérebro.
          </p>
          <p>
            Mesmo utilizando informações do FlyWire, ainda existem adaptações necessárias para fazer a estrutura funcionar dentro de um jogo.
          </p>
          <p>
            Além disso, o ambiente utilizado é bastante limitado quando comparado às condições em que um organismo real recebe e processa informações.
          </p>
          <p>
            Por isso, o projeto não busca provar que o sistema pensa como uma mosca, mas explorar o que podemos construir computacionalmente a partir de informações sobre sua organização neural.
          </p>
        </section>

        {/* 7. Conclusão */}
        <section className="space-y-2.5 pt-4 border-t border-white/15">
          <h2 className="font-display text-lg font-semibold text-[#aad751]">
            7. Conclusão
          </h2>
          <p>
            Esse projeto acabou sendo uma maneira interessante de estudar assuntos que normalmente aparecem separados.
          </p>
          <p>
            De um lado, temos programação, inteligência artificial e desenvolvimento de sistemas. Do outro, temos neurociência, conexões neuronais e processamento biológico de informações.
          </p>
          <p>
            Conseguir juntar essas áreas em uma aplicação prática é justamente o que torna o projeto interessante para mim.
          </p>
          <p>
            Ainda existem muitas coisas para testar e entender, principalmente em relação ao comportamento produzido pela estrutura neural e às diferenças em comparação com métodos convencionais.
          </p>
          <p>
            Minha intenção é continuar evoluindo a implementação, documentando os experimentos e entendendo melhor até onde isso pode chegar.
          </p>
        </section>
      </div>
    </article>
  )
}
