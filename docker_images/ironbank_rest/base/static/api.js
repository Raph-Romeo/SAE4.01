function censor(x){
    a = "***** ****";
    for (var i=18;i<22;++i){
        if (i == 20){
            a += " ";
        }
        a += x[i];
    }
    return a;
}

function createAccount(name, is_current, balance=0){
    if (name != document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/client/account", true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("Content-Type", "application/json");
        account_name_edit.disabled = true;
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    account_name_edit.disabled = false;
                    response = JSON.parse(xhr.responseText)
                    if ("error" in response){
                        alert(response.error);
                    }else{
                        hide_popup();
                        get_accounts(response.id);
                    }
                } else {
                    console.error(xhr.statusText)
                    alert("Erreur de communication avec le serveur : " + xhr.statusText)
                    account_name_edit.disabled = false;
                    account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
                }
            }
        };
        xhr.onerror = (e) => {
            alert("Erreur de communication avec le serveur : " + xhr.statusText)
            account_name_edit.disabled = false;
            account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
        };
        xhr.send(JSON.stringify({"name":name,"is_current":is_current,"balance":balance},null,1));
    }
}

function EditAccountName(name){
    if (name != document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText){
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/api/client/account/" + currentAccount.id, true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("Content-Type", "application/json");
        account_name_edit.disabled = true;
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    account_name_edit.disabled = false;
                    response = JSON.parse(xhr.responseText)
                    if ("error" in response){
                        alert(response.error);
                        account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
                    }else{
                        document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText = name;
                        currentAccount.name = name
                    }
                } else {
                    console.error(xhr.statusText);
                    alert("Erreur de communication avec le serveur : " + xhr.statusText)
                    account_name_edit.disabled = false;
                    account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
                }
            }
        };
        xhr.onerror = (e) => {
            alert("Erreur de communication avec le serveur : " + xhr.statusText)
            account_name_edit.disabled = false;
            account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
        };
        xhr.send(JSON.stringify({"name":name},null,1));
    }
}

function accountSelect(id, force=false){
    if (!force && currentAccount.id == id || content_right.classList.contains("retracted") && !force){
        retractAccountDetails();
    }
    if ((currentAccount != null && currentAccount.id != id) || force){
        if (typeof(account_name_edit) != "undefined" && typeof(account_details) != "undefined"){
            account_name_edit.disabled = true;
        }
        let to_remove = [];for (var i =0;i<document.getElementsByClassName("account_selected").length;++i){to_remove.push(document.getElementsByClassName("account_selected")[i])}for (var i = 0;i<to_remove.length;++i){to_remove[i].classList.remove("account_selected")}
        document.querySelectorAll('[data-value=' + '"' + id + '"' + ']')[0].classList.add("account_selected")
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/client/account/" + id, true);
        xhr.onload = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              account = JSON.parse(xhr.responseText)
              currentAccount = account
              if (account.is_current){
                content_right.innerHTML = '<h1 class="content_title"><div onclick="retractAccountDetails(true)" class="account_retract_button"><img class="account_retract_button_icon" src="/static/assets/account_arrow.png"/></div> <input id="account_name_edit" max_length=40 class="account_name_edit"></h1> <ul class="account_view_tabs"> <li class="account_view_tab" onclick="accountViewSelectTab(0)" id="account_card"> Carte </li><li class="account_view_tab" onclick="accountViewSelectTab(1)" id="account_characteristics"> Caractéristiques </li><li class="account_view_tab" onclick="accountViewSelectTab(2)" id="account_operations"> Opérations </li> </ul><div class="account_details" id="account_details"></div>';
                accountViewSelectTab(0);
              }else{
                content_right.innerHTML = '<h1 class="content_title"><div onclick="retractAccountDetails(true)" class="account_retract_button"><img class="account_retract_button_icon" src="/static/assets/account_arrow.png"/></div> <input id="account_name_edit" max_length=40 class="account_name_edit"></h1> <ul class="account_view_tabs"> <li class="account_view_tab" onclick="accountViewSelectTab(1)" id="account_characteristics"> Caractéristiques </li><li class="account_view_tab" id="account_operations" onclick="accountViewSelectTab(2)"> Opérations </li> </ul><div class="account_details" id="account_details"></div>';
                accountViewSelectTab(1);
              }
              account_name_edit.value = account.name;
              account_name_edit.addEventListener("keyup", ({key}) => {
                if (key === "Enter") {
                    EditAccountName(account_name_edit.value);
                }
              })
            } else {
              alert("Erreur de communication avec le serveur : " + xhr.statusText);
            }
          }
        };
        xhr.onerror = (e) => {
          alert("Erreur de communication avec le serveur : " + xhr.statusText);
        };
        xhr.send(null);
    }
}

function deleteAccount(id){
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api/client/account/" + id, true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.onload = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              response = JSON.parse(xhr.responseText)
              if ("error" in response){
                alert(response.error)
              }else{
                currentAccount = null;
                get_accounts();
              }
            } else {
              alert("Erreur de communication avec le serveur : " + xhr.statusText)
            }
          }
        };
        xhr.onerror = (e) => {
          alert("Erreur de communication avec le serveur : " + xhr.statusText)
        };
        xhr.send(null);
}

function get_accounts(id=null){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/client/account", true);
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          html_code = '<div class="content_left"><h1 class="content_title"> Comptes <div title="Ajouter un compte" onclick="createAccountPopup()" class="add_account_button"> <img src="/static/assets/ajouter.png" class="add_account"> </h1><p> Comptes courants </p>';
          accounts = JSON.parse(xhr.responseText).accounts;
          current = "";
          savings = "";
          for (var i=0;i<accounts.length;i++){
            name = "<div class='card_view_name'>" + accounts[i].name + "</div>";
            if (accounts[i].balance_raw < 0){
                balance = "<div class='card_view_balance' style='color:#ce0000'>" + accounts[i].balance + "</div>";
            }else{
                balance = "<div class='card_view_balance'>" + accounts[i].balance + "</div>";
            }
            iban = "<div class='card_view_iban'>" + censor(accounts[i].iban) + "</div>";
            owner = "<div class='card_view_owner'><img class='card_view_owner_img' src='/static/assets/owner.png'>" + accounts[i].owner + "</div>";
            this_account = '<div class="card account_view" onclick="accountSelect(this.getAttribute(\'data-value\'))" data-value="' + accounts[i].id + '">' + name + iban + balance + owner + '</div>';
            if (accounts[i].is_current){
                current += this_account;
            }else{
                savings += this_account;
            }
          }
          if (savings.length > 0){
            html_code += current + '<p> Épargnes </p>' + savings + '</div><div id="content_right" class="content_right retracted"></div>';
          }else{
            html_code += current + '</div><div id="content_right" class="content_right retracted"></div>';
          }
          content.innerHTML = html_code;
          load_animation.style.opacity = 0;
          if (id == null){
              if (currentAccount == null){
                accountSelect(accounts[0].id, true);
              }else{
                accountSelect(currentAccount.id, true);
              }
          }else{
            accountSelect(id)
          }
        } else {
          alert("Erreur de communication avec le serveur : " + xhr.statusText)
        }
      }
    };
    xhr.onerror = (e) => {
      alert("Erreur de communication avec le serveur : " + xhr.statusText)
    };
    xhr.send(null);
}

function getAccountsForm(callback){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/client/account", false);
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          html_code = '<p> Comptes courants </p>';
          accounts = JSON.parse(xhr.responseText).accounts;
          current = "";
          savings = "";
          for (var i=0;i<accounts.length;i++){
            name = "<div class='card_view_name'>" + accounts[i].name + "</div>";
            if (accounts[i].balance_raw < 0){
                balance = "<div class='card_view_balance' style='color=#ce0000'>" + accounts[i].balance + "</div>";
            }else{
                balance = "<div class='card_view_balance'>" + accounts[i].balance + "</div>";
            }
            iban = "<div class='card_view_iban'>" + censor(accounts[i].iban) + "</div>";
            owner = "<div class='card_view_owner'><img class='card_view_owner_img' src='/static/assets/owner.png'>" + accounts[i].owner + "</div>";
            this_account = '<div class="card account_view" data-value="f' + accounts[i].id + '" onclick="transactionFormSelectAccount(' + accounts[i].id + ',\'' + accounts[i].name.replaceAll("'","\\'") + '\',\'' + accounts[i].iban + '\')">' + name + iban + balance + owner + '</div>';
            if (accounts[i].is_current){
                current += this_account;
            }else{
                savings += this_account;
            }
          }
          if (savings.length > 0){
            html_code += current + '<p> Épargnes </p>' + savings + '</div>';
          }else{
            html_code += current + '</div>';
          }
          callback(html_code);
        } else {
          alert("Erreur de communication avec le serveur : " + xhr.statusText)
        }
      }
    };
    xhr.onerror = (e) => {
      alert("Erreur de communication avec le serveur : " + xhr.statusText)
    };
    xhr.send(null);
}


function history(){
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/client/transaction", true);
        xhr.onload = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                response = JSON.parse(xhr.responseText)
                data = "";
                if (response.transactions_pending.length + response.transactions.length == 0){
                    data += "<h3>Vous n'avez effectué aucune opération.</h3>";
                }else{
                    data = "<div class='transaction_view_sidebar'>";
                    if (response.transactions_pending.length > 0){
                        data += "<div class='transaction_view_sidebar_title'>Operations en attente de validation : </div>";
                        for (var i=0;i<response.transactions_pending.length;++i){
                            data += transactionHtmlFormatHistory(response.transactions_pending[i]);
                        }
                    }
                    if (response.transactions.length > 0){
                        dates = [];
                        for (var i=0;i<response.transactions.length;++i){
                            date = response.transactions[i].transaction_date.split("T")[0];
                            if (!dates.includes(date)){
                                dates.push(date);
                                console.log(date,dates);
                                data += "<div class='transaction_view_sidebar_title'>" + date + " : </div>";
                            }
                            data += transactionHtmlFormatHistory(response.transactions[i]);
                        }
                    }
                }
                content.innerHTML = '<div class="history_wrapper"> <h1 class="content_title">Historique</h1>' + data + '</div>'
            } else {
              alert("Erreur de communication avec le serveur : " + xhr.statusText)
            }
          }
        };
        xhr.onerror = (e) => {
          alert("Erreur de communication avec le serveur : " + xhr.statusText)
        };
        xhr.send(null);
}

function makeDeposit(name, amount, destination, account_name){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/client/transaction", true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    response = JSON.parse(xhr.responseText)
                    if ("error" in response){
                        alert(response.error);
                    }else{
                        if (response.is_pending){
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Votre dépot de <b>" + amount + "€</b> dans le compte <b>" + account_name + "</b> est en attente de validation d'un personnel. </h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }else{
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> <b>" + amount + "€</b> ont été déposés dans le compte <b>" + account_name + "</b> avec succès. </h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }
                    }
                } else {
                    console.error(xhr.statusText)
                    alert("Erreur de communication avec le serveur : " + xhr.statusText)
                    account_name_edit.disabled = false;
                    account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
                }
            }
        };
        xhr.onerror = (e) => {
            alert("Erreur de communication avec le serveur : " + xhr.statusText)
        };
        xhr.send(JSON.stringify({"name":name,"type":1,"amount":amount,"destination":destination},null,1));
}

function makeWithdrawal(name, amount, source, account_name){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/client/transaction", true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    response = JSON.parse(xhr.responseText)
                    if ("error" in response){
                        alert(response.error);
                    }else{
                        if (response.is_pending){
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Votre prélèvement de <b>" + amount + "€</b> sur le compte <b>" + account_name + "</b> est en attente de validation d'un personnel. </h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }else{
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> <b>" + amount + "€</b> ont été prélevés dans le compte <b>" + account_name + "</b> avec succès. </h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }
                    }
                } else {
                    console.error(xhr.statusText)
                    alert("Erreur de communication avec le serveur : " + xhr.statusText)
                    account_name_edit.disabled = false;
                    account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
                }
            }
        };
        xhr.onerror = (e) => {
            alert("Erreur de communication avec le serveur : " + xhr.statusText)
        };
        xhr.send(JSON.stringify({"name":name,"type":2,"amount":amount,"source":source},null,1));
}

function makeTransfer(name, amount, source, account_names, destination){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/client/transaction", true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    response = JSON.parse(xhr.responseText)
                    if ("error" in response){
                        alert(response.error);
                    }else{
                        if (response.is_pending){
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Votre virement de <b>" + amount + "€</b> a partir du compte <b>" + account_names[0] + "</b> vers le compte <b>" + account_names[1] + "</b> est en attente de validation d'un personnel. </h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }else{
                            transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Votre virement de <b>" + amount + "€</b> a partir du compte <b>" + account_names[0] + "</b> vers le compte <b>" + account_names[1] + "</b> a été effectué avec success</h3> <h3> Vous pouvez fermer cette fenetre. </h3>";
                        }
                    }
                } else {
                    console.error(xhr.statusText)
                    alert("Erreur de communication avec le serveur : " + xhr.statusText)
                }
            }
        };
        xhr.onerror = (e) => {
            alert("Erreur de communication avec le serveur : " + xhr.statusText)
            account_name_edit.disabled = false;
            account_name_edit.value = document.querySelectorAll('[data-value=' + '"' + currentAccount.id + '"' + ']')[0].children[0].innerText;
        };
        xhr.send(JSON.stringify({"name":name,"type":3,"amount":amount,"source":source,"destination":destination},null,1));
}