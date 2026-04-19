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
    }
}
