function getFirstImage(e, t) {
    var a = $("<div>").html(e).find("img:first").attr("src");
    
    // Se for uma URL do ImgBB, retorna a URL original
    if (a && a.includes('i.ibb.co')) {
        return a;
    }
    
    // Para outras imagens, mantém o processamento básico sem proxy
    var o = a.lastIndexOf("/") || 0,
        r = a.lastIndexOf("/", o - 1) || 0,
        i = a.substring(0, r),
        s = a.substring(r, o),
        n = a.substring(o);
    
    if (s.match(/\/s[0-9]+/g) || s.match(/\/w[0-9]+/g)) {
        s = "/w72-h72";
    }
    
    return i + s + n;
}

function getPostImage(e, t, a, o) {
    var r = null != e[t].content ? e[t].content.$t : "";
    a = e[t].media$thumbnail ? e[t].media$thumbnail.url : "https://i.ibb.co/dp15JzT/ESAvatar.webp";
    
    // Se encontrar uma imagem do ImgBB no conteúdo, usa ela diretamente
    var imgbbMatch = r.match(/https?:\/\/i\.ibb\.co\/[a-zA-Z0-9]+\/[^"'\s]+/);
    if (imgbbMatch) {
        return imgbbMatch[0];
    }
    
    // Verifica se é um vídeo do YouTube
    if (r.indexOf(r.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1) {
        if (r.indexOf("<img") > -1) {
            if (r.indexOf(r.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < r.indexOf("<img")) {
                return a.replace("img.youtube.com", "i.ytimg.com").replace("/default.", "/maxresdefault.");
            } else {
                return getFirstImage(r);
            }
        } else {
            return a.replace("img.youtube.com", "i.ytimg.com").replace("/default.", "/maxresdefault.");
        }
    }
    
    // Para posts com imagens
    return r.indexOf("<img") > -1 ? getFirstImage(r) : "https://i.ibb.co/dp15JzT/ESAvatar.webp";
}

function beautiAvatar(e) {
    $(e).attr("src", function(e, t) {
        // Substitui avatares padrão pelo avatar ImgBB
        t = t.replace("//resources.blogblog.com/img/blank.gif", "//i.ibb.co/dp15JzT/ESAvatar.webp");
        t = t.replace("//lh3.googleusercontent.com/zFdxGE77vvD2w5xHy6jkVuElKv-U9_9qLkRYK8OnbDeJPtjSZ82UPq5w6hJ-SA=s35", "//i.ibb.co/dp15JzT/ESAvatar.webp");
        
        // Se já for uma URL do ImgBB, mantém como está
        if (t.includes('i.ibb.co')) {
            return t;
        }
        
        // Para outros casos, aplica o redimensionamento padrão
        return t.replace("/s35", "/s39");
    });
}

// Função adicional para garantir que as URLs do ImgBB não sejam convertidas
function preventProxyConversion() {
    // Remove atributos data-srcset que possam causar conversão para proxy
    $('img[data-srcset]').removeAttr('data-srcset');
    
    // Remove classes que possam trigger lazy loading com proxy
    $('img.lazy-img').removeClass('lazy-img');
    
    // Força URLs diretas do ImgBB
    $('img').each(function() {
        var src = $(this).attr('src');
        if (src && src.includes('googleusercontent.com/blogger_img_proxy')) {
            // Extrai a URL original se estiver codificada no proxy
            var originalUrl = decodeURIComponent(src.split('=')[1]);
            if (originalUrl.includes('i.ibb.co')) {
                $(this).attr('src', originalUrl);
            }
        }
    });
}

// Adiciona a chamada da função quando o documento estiver pronto
$(document).ready(function() {
    preventProxyConversion();
});
