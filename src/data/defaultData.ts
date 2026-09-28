import { RagSource } from '../types/citation';

export const DEFAULT_RAG_SOURCES: RagSource[] = [
  {
    id: 'src-1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
    year: 2017,
    publication: 'Advances in Neural Information Processing Systems (NeurIPS 30)',
    doi: '10.48550/arXiv.1706.03762',
    citationKey: 'vaswani2017attention',
    isActive: true,
    tags: ['Machine Learning', 'Transformers', 'NLP'],
    excerpt: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.`
  },
  {
    id: 'src-2',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2016,
    publication: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
    doi: '10.1109/CVPR.2016.90',
    citationKey: 'he2016deep',
    isActive: true,
    tags: ['Computer Vision', 'Deep Learning', 'ResNet'],
    excerpt: `Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers—8× deeper than VGG nets but still having lower complexity. An ensemble of these residual nets achieves 3.57% error on the ImageNet test set. This result won the 1st place on the ILSVRC 2015 classification task.`
  },
  {
    id: 'src-3',
    title: 'Language Models are Few-Shot Learners',
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah', 'Jared Kaplan', 'Prafulla Dhariwal', 'Arvind Neelakantan', 'Pranav Shyam', 'Girish Sastry', 'Amanda Askell', 'Sandhini Agarwal', 'Ariel Herbert-Voss', 'Gretchen Krueger', 'Tom Henighan', 'Rewon Child', 'Aditya Ramesh', 'Daniel M. Ziegler', 'Jeffrey Wu', 'Clemens Winter', 'Christopher Hesse', 'Mark Chen', 'Eric Sigler', 'Mateusz Litwin', 'Scott Gray', 'Benjamin Chess', 'Jack Clark', 'Christopher Berner', 'Sam McCandlish', 'Alec Radford', 'Ilya Sutskever', 'Dario Amodei'],
    year: 2020,
    publication: 'Advances in Neural Information Processing Systems (NeurIPS 33)',
    doi: '10.48550/arXiv.2005.14165',
    citationKey: 'brown2020language',
    isActive: true,
    tags: ['NLP', 'Few-Shot Learning', 'GPT-3'],
    excerpt: `Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. Here we show that scaling up language models greatly improves task-agnostic, few-shot performance. We train GPT-3, an autoregressive language model with 175 billion parameters, 10x more than any previous non-sparse language model, and test its performance in the few-shot setting. For all tasks, GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot demonstrations specified purely via text interaction with the model.`
  },
  {
    id: 'src-4',
    title: 'A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity',
    authors: ['Martin Jinek', 'Krzysztof Chylinski', 'Ines Fonfara', 'Michael Hauer', 'Jennifer A. Doudna', 'Emmanuelle Charpentier'],
    year: 2012,
    publication: 'Science 337 (6096): 816–821',
    doi: '10.1126/science.1225829',
    citationKey: 'jinek2012programmable',
    isActive: true,
    tags: ['Genetics', 'CRISPR-Cas9', 'Biochemistry'],
    excerpt: `Clustered regularly interspaced short palindromic repeats (CRISPR)/CRISPR-associated (Cas) systems provide bacteria and archaea with adaptive immunity against viruses and plasmids by using RNA to target and destroy foreign DNA. We demonstrate here that the Cas9 endonuclease is guided by two RNAs: a mature CRISPR RNA (crRNA) and a trans-activating crRNA (tracrRNA). We engineered a single-guide RNA (sgRNA) chimera that mimics the dual-RNA structure and directs Cas9 to introduce site-specific double-stranded breaks in target DNA. The Cas9 endonuclease cleaves DNA 3 base pairs upstream of the PAM motif. While sgRNA confers high programmable specificity, off-target cleavage can occur at sites with sequence homology.`
  },
  {
    id: 'src-5',
    title: 'Highly accurate protein structure prediction with AlphaFold',
    authors: ['John Jumper', 'Richard Evans', 'Alexander Pritzel', 'Tim Green', 'Michael Figurnov', 'Olaf Ronneberger', 'Kathryn Tunyasuvunakool', 'Russ Bates', 'Augustin Žídek', 'Alex Potapenko', 'Alexey Bridgland', 'Clemens Meyer', 'Simon A. A. Kohl', 'Anna Potapenko', 'Andrew J. Ballard', 'Andrew Cowie', 'Bernardino Romera-Paredes', 'Stanislav Nikolov', 'Rishub Jain', 'Jonas Adler', 'Trevor Back', 'Stig Petersen', 'David Reiman', 'Ellen Clancy', 'Michal Zielinski', 'Martin Steinegger', 'Michalina Pacholska', 'Tamas Berghammer', 'Sebastian Bodenstein', 'David Silver', 'Oriol Vinyals', 'Andrew W. Senior', 'Koray Kavukcuoglu', 'Pushmeet Kohli', 'Demis Hassabis'],
    year: 2021,
    publication: 'Nature 596: 583–589',
    doi: '10.1038/s41586-021-03819-2',
    citationKey: 'jumper2021highly',
    isActive: true,
    tags: ['Structural Biology', 'AlphaFold', 'AI for Science'],
    excerpt: `Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. Through an enormous experimental effort, the structures of some 100,000 unique proteins have been determined, but this represents a tiny fraction of the billions of known protein sequences. Here we demonstrate a computational method, AlphaFold, which can regularly predict protein 3D structures with atomic accuracy even when no similar structure is known. In the 14th Critical Assessment of Structure Prediction (CASP14), our model achieved a median backbone accuracy of 0.96 Å r.m.s.d.95 and an all-atom accuracy of 1.5 Å r.m.s.d.95, significantly outperforming all other approaches.`
  }
];

export interface ManuscriptPreset {
  id: string;
  name: string;
  category: string;
  text: string;
  description: string;
}

export const MANUSCRIPT_PRESETS: ManuscriptPreset[] = [
  {
    id: 'deep-learning-transformers',
    name: 'Transformer & Residual Networks (Verification & Hallucination Demo)',
    category: 'Computer Science & AI',
    description: 'Contains verified claims backed by Vaswani et al. and He et al., plus a deliberate hallucinated claim regarding GPT-3 parameters to test the Warning Module.',
    text: `The Transformer architecture departs from classical sequence transduction by eschewing recurrence and convolutions entirely, relying solely on self-attention mechanisms to model global dependencies. On the WMT 2014 English-to-German translation benchmark, the Transformer achieved a state-of-the-art score of 28.4 BLEU while requiring substantially less training time than recurrent models.

Residual learning eases the optimization of substantially deeper neural networks by reformulating layer mappings as learning residual functions with reference to layer inputs. In empirical evaluations on the ImageNet dataset, residual networks achieved a winning 3.57% test error rate with architectures reaching up to 152 layers.

Remarkably, the original GPT-3 model was engineered with only 45,000 trainable parameters and was fully converged on a single Raspberry Pi embedded device in 14 seconds. Furthermore, contemporary neural networks exhibit zero degradation when scaled past one trillion layers without any residual shortcuts or normalization layers.`
  },
  {
    id: 'biomedical-crispr-alphafold',
    name: 'CRISPR-Cas9 & AlphaFold Structural Biology',
    category: 'Biotechnology & Genomics',
    description: 'Academic claims regarding dual-RNA guided Cas9 cleavage and atomic accuracy protein prediction in CASP14.',
    text: `The Cas9 endonuclease can be programmed using an engineered single-guide RNA chimera that mimics the natural crRNA and tracrRNA duplex to induce site-specific double-stranded breaks in target DNA. The enzyme cleaves phosphodiester bonds specifically three base pairs upstream of the protospacer adjacent motif (PAM).

Computational structural biology achieved atomic accuracy with AlphaFold, which attained a median backbone accuracy of 0.96 Å r.m.s.d.95 in the CASP14 blind assessment. Experimental X-ray crystallography has now been rendered entirely obsolete across all academic institutions worldwide, with physical laboratories universally dismantled in 2022.`
  },
  {
    id: 'literature-review-stub',
    name: 'Blank Academic Scratchpad',
    category: 'Custom Manuscript',
    description: 'Start typing or paste your manuscript draft to analyze claims against your RAG library.',
    text: `Type or paste your academic literature review or paper excerpt here. Place your cursor at any sentence to analyze citations and inject verified references, or detect unsupported statements.`
  }
];
