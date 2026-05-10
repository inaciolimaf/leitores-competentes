DESCRIPTORS = {
    "2L3": {
        "name": "Localizar informação explícita em textos",
        "description": (
            "O aluno deve localizar uma informação que está escrita de forma "
            "clara e direta no texto, sem precisar fazer inferências."
        ),
        "text_types": [
            "contos curtos",
            "fábulas",
            "notícias simples",
            "bilhetes",
            "receitas",
            "convites",
            "cartazes informativos",
        ],
        "search_queries": [
            "texto curto para 3 ano fundamental fábula conto",
            "texto informativo simples para crianças ensino fundamental",
        ],
        "needs_image": False,
        "notes": (
            "As perguntas devem pedir informações que estejam escritas "
            "explicitamente no texto, como nomes, datas, lugares, objetos."
        ),
    },
    "2L4": {
        "name": "Reconhecer a finalidade de um texto",
        "description": (
            "O aluno deve identificar para que o texto foi escrito: informar, "
            "divertir, ensinar, convencer, convidar etc."
        ),
        "text_types": [
            "receitas culinárias",
            "convites",
            "cartazes de campanha",
            "propagandas",
            "bilhetes",
            "instruções de jogo",
            "notícias",
            "piadas",
        ],
        "search_queries": [
            "exemplos de gêneros textuais para 3 ano fundamental",
            "texto convite receita propaganda crianças ensino fundamental",
        ],
        "needs_image": False,
        "notes": (
            "Use textos de gêneros variados para que o aluno identifique "
            "a finalidade principal (informar, instruir, divertir, convencer, convidar)."
        ),
    },
    "2L5": {
        "name": "Inferir informação em textos verbais",
        "description": (
            "O aluno deve compreender informações que não estão escritas de "
            "forma explícita, mas podem ser deduzidas a partir de pistas do texto."
        ),
        "text_types": [
            "contos com moral implícita",
            "poemas curtos",
            "fábulas",
            "crônicas curtas para crianças",
            "piadas",
        ],
        "search_queries": [
            "fábula com moral implícita para crianças 3 ano",
            "texto com inferência para ensino fundamental anos iniciais",
        ],
        "needs_image": False,
        "notes": (
            "O texto deve conter pistas para que o aluno deduza sentimentos, "
            "intenções, causas ou consequências não ditas diretamente."
        ),
    },
    "2L6": {
        "name": "Inferir informações em textos que articulam linguagem verbal e não verbal",
        "description": (
            "O aluno deve interpretar textos que combinam palavras e imagens, "
            "como tirinhas, charges, infográficos e HQs."
        ),
        "text_types": [
            "tirinhas",
            "histórias em quadrinhos",
            "charges",
            "infográficos simples",
            "capas de livros",
        ],
        "search_queries": [
            "tirinha para crianças 3 ano ensino fundamental imagem -prova -atividade -exercício -folha",
            "quadrinhos turma da monica 3 ano -atividade -exercício",
            "tirinha hagar o horrível puro -atividade",
            "tirinha snoop leitura infantil -exercício",
            "tirinha mafalda português interpretação -atividade -escola",
            "calvin e haroldo tirinhas português -folha -dever",
            "menino maluquinho tirinha leitura -exercicio -prova",
            "tirinhas curtas armandinho leitura -atividade"
        ],
        "needs_image": True,
        "notes": (
            "IMPORTANTE: Este descritor EXIGE imagem. Use o Tavily para buscar "
            "tirinhas ou HQs com URL de imagem acessível. "
            "O aluno deve interpretar a combinação de texto e imagem."
        ),
    },
    "2L7": {
        "name": "Reconhecer o gênero discursivo",
        "description": (
            "O aluno deve identificar o gênero do texto apresentado "
            "(fábula, receita, poema, notícia, carta etc.)."
        ),
        "text_types": [
            "fábulas",
            "receitas",
            "poemas",
            "notícias",
            "cartas",
            "diários",
            "listas",
            "parlendas",
            "cantigas",
        ],
        "search_queries": [
            "exemplos curtos de gêneros textuais para crianças 3 ano",
            "parlenda cantiga poema receita exemplo curto infantil",
        ],
        "needs_image": False,
        "notes": (
            "Apresente o texto e pergunte qual é o gênero. "
            "Use textos com características marcantes do gênero."
        ),
    },
    "2L8": {
        "name": "Identificar o propósito comunicativo em diferentes gêneros",
        "description": (
            "O aluno deve reconhecer qual é a intenção do autor ao "
            "produzir um texto de determinado gênero."
        ),
        "text_types": [
            "propagandas",
            "cartazes escolares",
            "avisos",
            "convites",
            "receitas",
            "piadas",
            "regras de jogo",
            "verbetes de enciclopédia infantil",
        ],
        "search_queries": [
            "exemplos de propagandas e cartazes infantis propósitos",
        ],
        "needs_image": False,
        "notes": (
            "HÍBRIDO: Se for fazer um CARTAZ ou PROPAGANDA, escreva o conteúdo que "
            "estaria no papel de forma direta. NUNCA narre ou explique o texto."
        ),
    },
    # NOVOS DESCRITORES 5º ANO (Filtrados os repetidos)
    "5PL3": {
        "name": "Inferir o sentido de uma palavra ou expressão",
        "description": "O aluno deve descobrir o significado de uma palavra desconhecida através do contexto.",
        "text_types": ["textos informativos", "poemas", "fábulas clássicas"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Use uma palavra ou expressão incomum para a idade e peça o sentido pelo contexto."
    },
    "5PL4": {
        "name": "Reconhecer o tema de um texto",
        "description": "Identificar o assunto principal de um texto.",
        "text_types": ["notícias", "artigos de opinião curtos", "reportagens"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Faça perguntas sobre o argumento central ou tópico geral abordado na leitura."
    },
    "5PL5": {
        "name": "Distinguir fato de opinião",
        "description": "Diferenciar o que é um relato narrativo concreto do que é a opinião de quem narra.",
        "text_types": ["cartas do leitor", "reportagens", "entrevistas curtas"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Apresente frases do texto e exija que o aluno marque qual é a opinião."
    },
    "5CT3": {
        "name": "Reconhecer elementos da narrativa e conflito gerador",
        "description": "Identificar tempo, espaço, personagens e o problema/conflito central do enredo.",
        "text_types": ["contos de mistério infantil", "contos de fadas", "lendas"],
        "search_queries": [],
        "needs_image": False,
        "notes": "A questão deve se debruçar sobre qual foi o estopim da história ou os elementos."
    },
    "5RT1": {
        "name": "Comparação de textos de um mesmo tema",
        "description": "Reconhecer diferentes formas de tratar uma mesma informação agrupando ou confrontando dois textos curtos.",
        "text_types": ["texto informativo duplo", "poemas lado a lado"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Ao gerar, crie pequenos Texto 1 e Texto 2 abordando o mesmo assunto e peça para o aluno comparar se eles concordam ou divergem."
    },
    "5CC1": {
        "name": "Estabelecer relações lógico-discursivos (conjunções, advérbios)",
        "description": "Compreender o sentido que uma conjunção ou advérbio (mas, porém, assim, lá) dá à frase.",
        "text_types": ["crônicas narrativas", "notícias"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Destaque palavras coesivas explícitas e questione o efeito ou sentido (oposição, tempo, etc)."
    },
    "5CC2": {
        "name": "Reconhecer relações entre partes com recursos coesivos",
        "description": "Identificar a quem se refere um pronome ou expressão substituta para evitar repetição.",
        "text_types": ["contos populares", "biografias curtas"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Peça para o aluno apontar quem é o 'ele', 'essa', etc."
    },
    "5CC3": {
        "name": "Relação causa/consequência",
        "description": "Estabelecer as relações de causa e consequência entre eventos do texto.",
        "text_types": ["notícias curtas", "fábulas causais"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Questionar: por que algo aconteceu e qual foi a geração desencadeada por tal ato?"
    },
    "5ES1": {
        "name": "Utilizar adequadamente a pontuação",
        "description": "Compreender os efeitos de sentido gerados por pontos de exclamação, interrogação, reticências, etc.",
        "text_types": ["anedotas", "textos teatrais curtos", "diálogos crônicos"],
        "search_queries": [],
        "needs_image": False,
        "notes": "Questionar o motivo do uso de reticências ou qual sentimento exclama."
    },
    "5ES2": {
        "name": "Reconhecer efeito de humor e de ironia",
        "description": "Interpretar qual elemento textual quebra a expectativa causando humor ou ironia.",
        "text_types": ["anedotas", "crônicas bem humoradas", "teatro infantil"],
        "search_queries": [],
        "needs_image": False,
        "notes": "O LLM deve inventar piadas infantis ou anedotas super inofensivas e com duplo sentido literário que gere quebra cômica."
    },
    "5VL1": {
        "name": "Identificar variações e níveis de linguagem",
        "description": "Reconhecer marcas linguísticas (regionalismos, gírias, linguagem formal vs informal) e os tipos de locutor.",
        "text_types": ["causos", "poesias caipiras", "diálogos entre jovens"],
        "search_queries": [],
        "needs_image": False,
        "notes": "O LLM deve simular falas regionalistas ou informais (gírias infantis, diminutivos) e pedir que o aluno note isso."
    },
    # DESCRITORES DE MATEMÁTICA — 5º ANO
    "5N1": {
        "name": "Reconhecer e utilizar características do sistema de numeração decimal",
        "description": (
            "O aluno deve reconhecer valor posicional, composição/decomposição, "
            "leitura e escrita de números no sistema de numeração decimal."
        ),
        "text_types": ["situação-problema curta", "enunciado matemático direto"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Crie enunciados envolvendo valor posicional (unidade, dezena, centena, milhar), "
            "composição/decomposição (ex.: 3.452 = 3000 + 400 + 50 + 2) ou leitura/escrita por extenso. "
            "Não use imagens — apenas números e texto direto."
        ),
    },
    "5N3": {
        "name": "Calcular o resultado de uma das quatro operações com números naturais, decimais ou fracionários",
        "description": (
            "O aluno deve efetuar adição, subtração, multiplicação ou divisão "
            "com números naturais, decimais ou frações."
        ),
        "text_types": ["expressão numérica", "cálculo direto"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Apresente o cálculo de forma direta (ex.: '12,5 + 7,8 =' ou '3/4 + 1/4 ='). "
            "NÃO contextualize em situação-problema; foco é no cálculo puro. "
            "Varie entre naturais, decimais e fracionários."
        ),
    },
    "5N4": {
        "name": "Resolver problema que envolva uma das quatro operações com números naturais, decimais e fracionários",
        "description": (
            "O aluno deve interpretar uma situação-problema e escolher a operação "
            "correta (adição, subtração, multiplicação ou divisão) para resolvê-la."
        ),
        "text_types": ["situação-problema do cotidiano", "problema escolar curto"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Crie um pequeno enunciado contextualizado (compras, distâncias, partilha, receitas) "
            "e exija que o aluno identifique a operação e calcule o resultado. "
            "Diferente do 5N3, aqui o foco é a INTERPRETAÇÃO do problema."
        ),
    },
    "5G3": {
        "name": "Identificar poliedros e corpos redondos através das suas características e propriedades",
        "description": (
            "O aluno deve distinguir poliedros (cubo, paralelepípedo, pirâmide, prisma) "
            "de corpos redondos (esfera, cilindro, cone) com base em suas propriedades."
        ),
        "text_types": ["enunciado descritivo de sólido", "comparação entre figuras"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Descreva o sólido em palavras (ex.: 'tem 6 faces quadradas iguais' ou "
            "'tem uma base circular e uma superfície curva que termina em ponta') "
            "e peça para o aluno identificar a figura. NÃO use imagens — descreva textualmente."
        ),
    },
    "5G5": {
        "name": "Identificar números de faces, arestas e vértices de figuras geométricas tridimensionais",
        "description": (
            "O aluno deve contar ou reconhecer a quantidade de faces, arestas e vértices "
            "de sólidos geométricos como cubo, paralelepípedo, pirâmide, prisma."
        ),
        "text_types": ["enunciado direto sobre sólido", "tabela de propriedades"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Pergunte diretamente sobre o número de faces, arestas ou vértices de um sólido nomeado "
            "(ex.: 'Quantas arestas tem um cubo?'). "
            "Pode-se descrever o sólido em palavras quando útil. NÃO use imagens."
        ),
    },
    "5M2": {
        "name": "Resolver problemas utilizando unidades de medidas padronizadas (km/m/cm/mm, kg/g/mg, l/ml)",
        "description": (
            "O aluno deve resolver problemas envolvendo conversão e uso de unidades "
            "de comprimento, massa e capacidade."
        ),
        "text_types": ["situação-problema com medidas", "conversão de unidades"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Crie problemas envolvendo conversões (ex.: m → cm, kg → g, l → ml) ou "
            "comparações entre unidades. Use contextos do cotidiano (receitas, distâncias, peso). "
            "Apresente os dados em texto, sem imagem."
        ),
    },
    "5M3": {
        "name": "Estabelecer relações entre unidades de medida de tempo (início, intervalo e término)",
        "description": (
            "O aluno deve calcular horário de início, duração ou término de eventos, "
            "convertendo entre horas e minutos quando necessário."
        ),
        "text_types": ["situação-problema com horários", "agenda escolar"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Crie situações com horário de início + duração → término (ou variações). "
            "Ex.: 'A aula começou às 13h20 e durou 1h40min. A que horas terminou?'. "
            "Use formato 24h ou 'da manhã/da tarde' conforme apropriado."
        ),
    },
    "5M6": {
        "name": "Estabelecer trocas entre cédulas e moedas e resolver problemas com o sistema monetário brasileiro",
        "description": (
            "O aluno deve trabalhar com cédulas e moedas do Real, calculando trocos, "
            "totais de compras e equivalências entre cédulas/moedas."
        ),
        "text_types": ["situação-problema de compra", "troca de cédulas e moedas"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Use cédulas reais (R$ 2, 5, 10, 20, 50, 100) e moedas (R$ 0,05, 0,10, 0,25, 0,50, 1,00). "
            "Crie problemas de troco, compras múltiplas ou equivalência (ex.: 'Quantas moedas de 25 centavos formam R$ 2,00?'). "
            "Use a notação R$ corretamente."
        ),
    },
    "5P1": {
        "name": "Ler informações apresentadas em tabelas ou gráficos de colunas/barras",
        "description": (
            "O aluno deve interpretar dados em tabelas simples ou gráficos de colunas/barras, "
            "identificando valores, maior/menor e fazendo comparações."
        ),
        "text_types": ["tabela simples", "gráfico de colunas", "gráfico de barras"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Represente a tabela em MARKDOWN (com | e ---) ou descreva o gráfico de colunas/barras "
            "listando categoria → valor de forma clara (ex.: 'Segunda: 12 alunos; Terça: 18 alunos'). "
            "Pergunte sobre leitura direta, comparação ou totais. NÃO use imagens externas."
        ),
    },
    "5P3": {
        "name": "Compreender a noção de chance e reconhecer eventos possíveis e impossíveis",
        "description": (
            "O aluno deve classificar eventos como possíveis, impossíveis ou certos, "
            "e comparar a chance de ocorrência de eventos simples."
        ),
        "text_types": ["situação-problema de probabilidade", "sorteio simples"],
        "search_queries": [],
        "needs_image": False,
        "notes": (
            "Use contextos simples (dados, urnas com bolas coloridas, sorteios) "
            "e peça para o aluno classificar o evento (possível, impossível, certo) "
            "ou comparar chances (mais provável / menos provável / igualmente provável)."
        ),
    },
}
