import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { CategoryComponent } from "../../../components/Category/CategoryComponent";

export default function CategorySlugPage({ params }) {
    const { slug } = params;
    
    return (
        <>  
            <Header />
            <CategoryComponent categorySlug={slug} />
            <Footer />
        </>
    );
}

// Static params for known categories
export async function generateStaticParams() {
    return [
        { slug: 'videographers' },
        { slug: 'producers' },
        { slug: 'recording-studios' },
        { slug: 'album-cover-artists' },
        { slug: 'musicians' },
        { slug: 'songwriters' },
        { slug: 'mixing-engineers' },
        { slug: 'mastering-engineers' }
    ];
}

// Metadata generation
export async function generateMetadata({ params }) {
    const { slug } = params;
    
    const categoryNames = {
        'videographers': 'Video Çekimi Uzmanları',
        'producers': 'Müzik Prodüktörleri',
        'recording-studios': 'Kayıt Stüdyoları',
        'album-cover-artists': 'Albüm Kapağı Tasarımcıları',
        'musicians': 'Müzisyenler',
        'songwriters': 'Şarkı Yazarları',
        'mixing-engineers': 'Mixing Uzmanları',
        'mastering-engineers': 'Mastering Uzmanları'
    };
    
    const categoryName = categoryNames[slug] || 'Kategori';
    
    return {
        title: `${categoryName} | Dripzone`,
        description: `${categoryName} kategorisindeki profesyonelleri keşfedin.`
    };
}
