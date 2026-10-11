/* Prepara le richieste del sito per la mail di Nascolor:
   oggetto leggibile, link WhatsApp/chiamata verso il cliente, conferma automatica al cliente. */
window.NC = (function(){
  var T = {
    it: {
      wa: function(n,t,l){ return "Buongiorno " + n + ", sono Naser di Nascolor Sagl. Ho ricevuto la sua richiesta" + (t ? " per " + t.toLowerCase() : "") + (l ? " a " + l : "") + ". Quando le andrebbe bene il sopralluogo?"; },
      auto: "Buongiorno,\n\ngrazie per averci contattato. Abbiamo ricevuto la sua richiesta e la richiamiamo entro un giorno lavorativo per fissare il sopralluogo gratuito.\n\nSe preferisce, può scriverci subito su WhatsApp: https://wa.me/41798901135\n\nCordiali saluti\nNascolor Sagl\nVia Mario Jäggli 1, 6500 Bellinzona\n079 890 11 35 · https://nascolorsagl.ch",
      tag: ""
    },
    de: {
      wa: function(n,t,l){ return "Guten Tag " + n + ", hier ist Naser von Nascolor Sagl. Ich habe Ihre Anfrage" + (l ? " in " + l : "") + " erhalten. Wann passt Ihnen ein Besichtigungstermin?"; },
      auto: "Guten Tag\n\nVielen Dank für Ihre Anfrage. Wir haben sie erhalten und rufen Sie innerhalb eines Arbeitstages an, um die kostenlose Besichtigung zu vereinbaren.\n\nSie können uns auch direkt auf WhatsApp schreiben: https://wa.me/41798901135\n\nFreundliche Grüsse\nNascolor Sagl\nVia Mario Jäggli 1, 6500 Bellinzona\n079 890 11 35 · https://nascolorsagl.ch",
      tag: "[DE] "
    },
    fr: {
      wa: function(n,t,l){ return "Bonjour " + n + ", ici Naser de Nascolor Sagl. J'ai bien reçu votre demande" + (l ? " à " + l : "") + ". Quand vous conviendrait une visite sur place ?"; },
      auto: "Bonjour,\n\nMerci de nous avoir contactés. Nous avons bien reçu votre demande et nous vous rappelons dans un jour ouvrable pour fixer la visite gratuite.\n\nVous pouvez aussi nous écrire directement sur WhatsApp : https://wa.me/41798901135\n\nMeilleures salutations\nNascolor Sagl\nVia Mario Jäggli 1, 6500 Bellinzona\n079 890 11 35 · https://nascolorsagl.ch",
      tag: "[FR] "
    }
  };

  // numero svizzero o internazionale -> solo cifre con prefisso paese (per wa.me)
  function intl(tel){
    var s = String(tel || "").trim(), d = s.replace(/\D/g, "");
    if (!d) return "";
    if (s.charAt(0) === "+") return d;
    if (d.indexOf("00") === 0) return d.slice(2);
    if (d.charAt(0) === "0") return "41" + d.slice(1);
    if (d.length === 9) return "41" + d;
    return d;
  }

  function val(form, name){
    var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]');
    return el && el.value ? el.value.trim() : "";
  }

  function prep(form, lang, kind){
    var t = T[lang] || T.it;
    var nome = val(form, "nome"), tel = val(form, "tel"), tipo = val(form, "tipo"),
        loc = val(form, "loc"), email = val(form, "email");
    var LBL = {tipo:"Lavoro", quando:"Quando", sopralluogo:"Sopralluogo preferito", nome:"Nome", tel:"Telefono", loc:"Località", msg:"Dettagli"};
    var fd = new FormData();
    new FormData(form).forEach(function(v, k){
      if (k === "form-name") return;
      if (k.charAt(0) !== "_" && k !== "email" && !String(v).trim()) return;
      fd.append(LBL[k] || k, v);
    });
    var parts = [tipo, loc, nome].filter(Boolean).join(" – ");
    fd.set("_subject", t.tag + (kind === "quick" ? "Da richiamare: " : "Richiesta sopralluogo: ") + parts);
    var n = intl(tel);
    if (n){
      fd.append("Rispondi su WhatsApp", "https://wa.me/" + n + "?text=" + encodeURIComponent(t.wa(nome.split(" ")[0] || "", tipo, loc)));
      fd.append("Chiama il cliente", "+" + n);
    }
    fd.append("Lingua del cliente", lang.toUpperCase());
    if (email){
      fd.set("_replyto", email);
      fd.set("_autoresponse", t.auto);
    }
    return fd;
  }

  return { prep: prep };
})();
