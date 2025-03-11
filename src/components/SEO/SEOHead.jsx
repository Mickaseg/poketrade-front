const SEOHead = ({
    title = "TradeHelper",
    description = "Facilitez vos échanges de cartes Pokémon TCG Pocket avec TradeHelper",
    canonicalUrl,
    ogImage = "/src/assets/824565.png",
    ogType = "website",
}) => {
    // Construct full title with site name
    const fullTitle =
        title === "TradeHelper" ? title : `${title} | TradeHelper`;

    return (
        <>
            {/* Basic Metadata */}
            <title>{fullTitle}</title>
        {console.log(fullTitle)}
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </>
    );
};

export default SEOHead;
