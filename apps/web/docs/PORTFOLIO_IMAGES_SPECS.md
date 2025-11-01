# Especificaciones de Imágenes para Portfolio - Generación con IA

Este documento contiene las especificaciones técnicas y prompts para generar todas las imágenes necesarias para los 6 casos de estudio del portfolio.

## Tamaños de Imágenes Requeridos

### 1. Hero Images (Imagen principal del caso de estudio)
- **Tamaño recomendado**: 1920px × 1080px (16:9)
- **Tamaño mínimo**: 1600px × 900px
- **Formato**: JPG, optimizado para web
- **Uso**: Imagen principal que aparece arriba en la página del caso de estudio
- **Ubicación**: `/images/portfolio/[slug]-hero.jpg`

### 2. Thumbnail Images (Imágenes para el grid de portfolio)
- **Tamaño recomendado**: 1280px × 960px (4:3)
- **Tamaño mínimo**: 800px × 600px
- **Formato**: JPG, optimizado para web
- **Uso**: Imagen que aparece en el grid de listing de portfolio
- **Ubicación**: `/images/portfolio/thumbnails/[slug].jpg`

### 3. Testimonial Images (Fotos de clientes para testimonios)
- **Tamaño recomendado**: 400px × 400px (1:1, cuadrado)
- **Tamaño mínimo**: 300px × 300px
- **Formato**: JPG, optimizado para web
- **Uso**: Foto del cliente que aparece en el testimonial
- **Ubicación**: `/images/portfolio/testimonials/[nombre-cliente].jpg`

---

## Prompts para Generación con IA

### 1. Restaurante Sabor Latino (Tampa)

#### Hero Image (1920×1080px)
```
Professional restaurant interior photography, modern Latin American restaurant in Tampa, warm ambient lighting, elegant tables with white tablecloths, colorful murals on walls, vibrant atmosphere, food photography style, shot with 85mm lens, shallow depth of field, natural window light, high-end restaurant aesthetic, professional food photography, warm tones, inviting atmosphere
```

#### Thumbnail (1280×960px)
```
Modern Latin American restaurant exterior, vibrant colors, inviting storefront, Tampa Florida style, professional restaurant photography, warm evening lighting, neon signs in Spanish and English, outdoor seating area, street photography style, commercial photography, eye-catching composition
```

#### Testimonial Photo - María González (400×400px)
```
Professional business portrait, Latina woman in her 40s, warm friendly smile, professional attire, restaurant owner, confident expression, soft natural lighting, professional headshot style, neutral background, Miami photography style
```

---

### 2. Dental Care Miami (Miami)

#### Hero Image (1920×1080px)
```
Modern dental clinic interior, Miami Florida, clean white and blue color scheme, professional medical environment, state-of-the-art dental equipment, bright natural lighting, spacious treatment rooms, contemporary medical design, professional healthcare photography, sterile clean aesthetic, modern healthcare facility
```

#### Thumbnail (1280×960px)
```
Modern dental clinic exterior, Miami Beach style, professional medical building, clean white facade, blue accents, professional signage "Dental Care Miami", palm trees in background, Florida architecture, commercial real estate photography, daytime lighting
```

#### Testimonial Photo - Dr. Carlos Rodríguez (400×400px)
```
Professional medical portrait, Hispanic male doctor in white coat, confident expression, stethoscope, professional healthcare headshot, soft lighting, neutral medical background, Miami professional photography style, trustworthy appearance
```

---

### 3. Law Firm Immigration Pro (Orlando)

#### Hero Image (1920×1080px)
```
Professional law office interior, Orlando Florida, elegant modern conference room, mahogany desk, legal books on shelves, American flag, professional legal environment, warm lighting, sophisticated law firm aesthetic, professional business photography, prestigious legal office
```

#### Thumbnail (1280×960px)
```
Modern law office building exterior, Orlando downtown, professional legal office facade, corporate building, glass and stone architecture, professional signage, Florida business district, commercial architecture photography, professional real estate style
```

#### Testimonial Photo - Lic. Ana Martínez (400×400px)
```
Professional legal portrait, Latina female attorney in business suit, confident professional expression, law firm background, professional headshot, soft natural lighting, Miami professional photography, authoritative yet approachable, professional legal attire
```

---

### 4. Serenity Wellness Spa (Fort Lauderdale)

#### Hero Image (1920×1080px)
```
Luxury spa interior, Fort Lauderdale Florida, serene wellness environment, soft pastel colors, massage tables, essential oils, candles, natural lighting, zen atmosphere, spa photography, wellness aesthetic, tranquil peaceful environment, high-end spa design
```

#### Thumbnail (1280×960px)
```
Elegant spa exterior, Fort Lauderdale beach style, luxury wellness center, soft pastel exterior, palm trees, spa signage, resort-like atmosphere, Florida coastal architecture, relaxing aesthetic, professional spa photography
```

#### Testimonial Photo - Laura Fernández (400×400px)
```
Professional portrait, Caucasian woman in her 40s, warm gentle smile, spa owner, wellness professional attire, soft natural lighting, serene background, professional headshot, approachable friendly expression, wellness industry style
```

---

### 5. Premier Realty Jacksonville (Jacksonville)

#### Hero Image (1920×1080px)
```
Modern real estate office interior, Jacksonville Florida, professional real estate agency, agents at desks, property listings on screens, modern office design, professional business environment, bright natural lighting, contemporary commercial space, real estate photography style
```

#### Thumbnail (1280×960px)
```
Modern real estate office building exterior, Jacksonville downtown, professional commercial building, "Premier Realty" signage, Florida business district architecture, glass facade, professional commercial photography, daytime lighting
```

#### Testimonial Photo - Michael Thompson (400×400px)
```
Professional business portrait, Caucasian male CEO in business suit, confident professional expression, real estate professional, corporate headshot style, neutral background, Jacksonville professional photography, authoritative trustworthy appearance
```

---

### 6. SparkleClean Services (Tampa)

#### Hero Image (1920×1080px)
```
Professional cleaning service, Tampa Florida, clean modern commercial space, professional cleaning equipment, uniformed cleaning staff, bright clean environment, professional service photography, commercial cleaning aesthetic, pristine clean appearance, service industry style
```

#### Thumbnail (1280×960px)
```
Commercial cleaning service van exterior, Tampa Florida, professional service vehicle, company branding, clean white and blue design, service industry aesthetic, commercial vehicle photography, professional cleaning service brand
```

#### Testimonial Photo - Roberto Silva (400×400px)
```
Professional portrait, Hispanic male business owner in uniform, friendly confident smile, cleaning service owner, professional headshot, soft lighting, neutral background, Tampa professional photography, approachable business owner
```

---

## Recomendaciones Generales para Prompts

1. **Estilo consistente**: Todas las imágenes deben tener un estilo profesional y moderno
2. **Colores**: Considerar los colores de marca (azul primario) donde sea apropiado
3. **Iluminación**: Luz natural y profesional, evitando sombras duras
4. **Composición**: Enfoque en el sujeto/negocio, fondos limpios y profesionales
5. **Calidad**: Alta resolución, nítidas, sin distorsiones
6. **Diversidad**: Asegurar diversidad en fotos de testimonios (diferentes etnias, edades, géneros)

## Notas Técnicas

- Todas las imágenes deben ser optimizadas para web (comprimidas pero manteniendo calidad)
- Usar Next.js Image component para optimización automática
- Considerar formato WebP para mejor compresión
- Las imágenes deben cargar rápidamente para buen performance

---

## Estructura de Directorios

```
apps/web/public/images/portfolio/
├── restaurante-tampa-hero.jpg
├── clinica-dental-miami-hero.jpg
├── abogado-inmigracion-orlando-hero.jpg
├── spa-bienestar-fortlauderdale-hero.jpg
├── agencia-bienes-raices-jacksonville-hero.jpg
├── servicios-limpieza-tampa-hero.jpg
├── thumbnails/
│   ├── restaurante-tampa.jpg
│   ├── clinica-dental-miami.jpg
│   ├── abogado-inmigracion-orlando.jpg
│   ├── spa-bienestar-fortlauderdale.jpg
│   ├── agencia-bienes-raices-jacksonville.jpg
│   └── servicios-limpieza-tampa.jpg
└── testimonials/
    ├── maria-gonzalez.jpg
    ├── carlos-rodriguez.jpg
    ├── ana-martinez.jpg
    ├── laura-fernandez.jpg
    ├── michael-thompson.jpg
    └── roberto-silva.jpg
```
