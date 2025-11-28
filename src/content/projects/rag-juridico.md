---
title: "Assistente Jurídico com RAG"
description: "Automação de pesquisa de jurisprudência usando LangChain e OpenAI, reduzindo o tempo de busca em 70%."
pubDate: 2024-03-15
tags: ["NLP", "LangChain", "Python"]
link: "https://github.com/seu-usuario/repo"
---

## O Problema
O escritório de advocacia gastava cerca de 4 horas diárias buscando jurisprudências em PDFs não estruturados. A busca por palavras-chave tradicional falhava em entender o contexto semântico.

## A Solução Técnica
Desenvolvi um pipeline RAG (Retrieval-Augmented Generation) utilizando:

1. **Ingestão:** Scripts Python para OCR em PDFs antigos.
2. **Embeddings:** Modelo `text-embedding-3-small` da OpenAI.
3. **Vetor Database:** Pinecone para busca de similaridade rápida.

### Exemplo de Código
Abaixo, um trecho da configuração do *retriever*:

\`\`\`python
vectorstore = PineconeVectorStore(
    index_name="jurisprudencia-idx",
    embedding=embeddings
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
\`\`\`

## Resultados
O sistema agora retorna citações precisas em segundos, com uma taxa de alucinação inferior a 2% graças ao prompt engineering focado em "Grounding".