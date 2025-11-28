import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		
        // z.coerce.date() é a melhor prática: 
        // Ele força qualquer string ou data válida a virar um objeto Date do JS.
        // Funciona igual a um pd.to_datetime() do Pandas.
		pubDate: z.coerce.date(), 
		
		tags: z.array(z.string()),
		
        // Deixei o url() opcional, pois as vezes o link não é uma URL válida ainda (ex: "#")
        // Se quiser validar URL estrita, use: z.string().url().optional()
		link: z.string().optional(), 
	}),
});

export const collections = {
	projects: projectsCollection,
};