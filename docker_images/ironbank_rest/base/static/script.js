const tabs = document.getElementsByClassName("tab")
let currentTab = -1;
let currentAccount = null;
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let notificationsPopupVisible = false;
let popup_visible = false;
let popup_transaction_type = null;
let currentFormData = null;


window.onclick = function(event) {
    if (event.target == main_popup) {
        hide_popup();
    }
}


function toggleNotifications(){
	if (notificationsPopupVisible){
		notificationsPopupVisible = false;
		notifications_popup_wrapper.classList.add("hidden")
	}else{
		notificationsPopupVisible = true;
		notifications_popup_wrapper.classList.remove("hidden")
	}
}

function selectTab(n){
    if (popup_visible){
        hide_popup();
    }
	if (currentTab != n){
	    if (currentTab == 0){
	        if (!content_right.classList.contains("retracted")){
	            retractAccountDetails();
	        }
	    }
		for (var i=0;i<tabs.length;++i){
			if (tabs[i].classList.contains("selected")){
				tabs[i].classList.remove("selected");
			}
		}
		currentTab = n;
		tabs[n].classList.add("selected");
		unload();
	}
}

function createAccountFormSubmit(){
    name = document.getElementById("create_account_form_name").value;
    type_of = document.getElementById("create_account_form_type").value;
    if (type_of == "current"){
        type_of = true;
    }else{
        type_of = false;
    }
    createAccount(name,type_of);
    return false;
}


function retractSidebar(){
	if (sidebar.classList.contains("retracted")){
		sidebar.classList.remove("retracted");
	}else{
		sidebar.classList.add("retracted");
	}
}


function retractAccountDetails(retract=null){
    if (retract == null){
        if (content_right.classList.contains("retracted")){
            content_right.classList.remove("retracted");
        }else{
            content_right.classList.add("retracted");
        }
    }else{
        if (currentTab == 0){
            if (!retract){
                content_right.classList.remove("retracted");
            }else{
                content_right.classList.add("retracted");
            }
        }
    }
}


function load(){
    content.innerHTML = ""
    if (currentTab == 0){
        get_accounts();
    }else if(currentTab == 1){
        transactions();
        load_animation.style.opacity = 0;
    }else if(currentTab == 2){
        history();
        load_animation.style.opacity = 0;
    }else if(currentTab == 3){
        settings()
        load_animation.style.opacity = 0;
    }
}

function unload(){
    load_animation.style.opacity = 1;
    setTimeout(load,200)
}

function transactionHtmlFormat(transaction){
    if (transaction.type == 1){
        type = "Dépôt"
    }else if (transaction.type == 2){
        type = "Prélèvement"
    }else{
        type = "Virement"
    }
    if (transaction.name[0]){
        return "<div class='transaction_view_sidebar_elem'><b>" + type + " </b> " + transaction.name[1] + " : " + transaction.amount + "</div>";
    }else{
        return "<div class='transaction_view_sidebar_elem'><b>" + type + " </b>" + transaction.amount + "</div>";
    }
}


function transactionHtmlFormatHistory(transaction){
    if (transaction.type == 1){
        type = "Dépôt"
    }else if (transaction.type == 2){
        type = "Prélèvement"
    }else{
        type = "Virement"
    }
    return "<div class='transaction_view_sidebar_elem'><b>" + type + " </b> " + transaction.name[1] + " : " + transaction.amount + "</div>";
}


function hide_popup(){
    main_popup.classList.add("hidden");
    popup_visible = false;
}


function createAccountPopup(){
    main_popup.classList.remove("hidden");
    popup_visible = true;
    popup_body.innerHTML = "<h3 class='popup_title'> Créer un compte <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return createAccountFormSubmit()' class='create_account_form'> <h3> Nom du compte </h3> <input id='create_account_form_name' minlength='3' maxlength='40' required> <h3> Type de compte </h3> <select id='create_account_form_type' required> <option value='' disabled selected hidden> Veuillez choisir </option> <option value='current'> Compte courrant </option> <option value='savings'> Compte epargne </option> </select> <input type='submit' value='Confirmer'> </form>"
}


function transactionFormSelectAccount(id, name, iban){
    if (popup_transaction_type == 1){
        currentFormData = {"id":id,"name":name};
        transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Quel montant voulez vous déposer dans le compte <b>" + name + "</b>?</h3><p>Montant:</p><div onclick='money_input.focus()' class='money_input_wrapper'><input class='money_input' id='money_input' value='5.00' type='number' min='1' step='any' required>€</div><input value='Déposer' type='submit'>";
    }else if(popup_transaction_type == 2){
        currentFormData = {"id":id,"name":name};
        transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> Quel montant voulez vous prélever sur le compte <b>" + name + "</b>?</h3><p>Montant:</p><div onclick='money_input.focus()' class='money_input_wrapper'><input class='money_input' id='money_input' value='5.00' type='number' min='1' step='any' required>€</div><input value='Prélever' type='submit'>";
    }else if(popup_transaction_type == 3){
        currentFormData = {"source":{"id":id,"name":name},"destination":{"id":null,"name":null}};
        popup_transaction_type = 4;
        getAccountsForm(data => accounts = data);
        transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'><b>" + name + "</b> → <b>?</b><br> Veuillez selectionner le compte dans lequel vous voulez effectuer le virement</h3>" + accounts;
        document.querySelectorAll('[data-value=' + '"f' + id + '"' + ']')[0].classList.add("disabled");
    }else if(popup_transaction_type == 4){
        currentFormData["destination"]["iban"] = iban;currentFormData["destination"]["name"] = name;
        transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> <b>" + currentFormData["source"].name + "</b> → <b>" + name + "</b><br>Vous souhaitez faire un virement de quel montant?</h3><p>Montant:</p><div onclick='money_input.focus()' class='money_input_wrapper'><input class='money_input' id='money_input' value='5.00' type='number' min='1' step='any' required>€</div><input value='Confirmer' type='submit'>";
    }else if(popup_transaction_type == 5){
        currentFormData = {"source":{"id":id,"name":name},"destination":{"id":null,"name":null}};
        transaction_inner_form.innerHTML = "<h3 class='transaction_form_title'> <b>" + currentFormData["source"].name + "</b> → <b>?</b><br>Veuillez inserer le montant du virement et l'IBAN du compte dans lequel vous souhaitez effectuer le virement.</h3><p>IBAN:</p><input name='iban_input' type='text' required minlength='24' maxlength='24' id='iban_input'><p>Montant:</p><div onclick='money_input.focus()' class='money_input_wrapper'><input class='money_input' id='money_input' value='5.00' type='number' min='1' step='any' required>€</div><input value='Confirmer' type='submit'>";
    }
}

function validateDepositForm(){
    makeDeposit(null, parseFloat(money_input.value), currentFormData.id , currentFormData.name);
    return false;
}

function validateWithdrawalForm(){
    makeWithdrawal(null, parseFloat(money_input.value), currentFormData.id, currentFormData.name);
    return false;
}

function validateTransferForm(n){
    if (n == 1){
        makeTransfer(null, parseFloat(money_input.value), currentFormData.source.id, [currentFormData.source.name,currentFormData.destination.name], currentFormData.destination.iban);
    }else{
        makeTransfer(null, parseFloat(money_input.value), currentFormData.source.id, [currentFormData.source.name,"IBAN :" + iban_input.value], iban_input.value);
    }
    return false;
}

function depositPopup(){
    main_popup.classList.remove("hidden");
    popup_visible = true;
    var accounts = "";
    popup_transaction_type = 1;
    getAccountsForm(data => accounts = data);
    popup_body.innerHTML = "<h3 class='popup_title'> Effectuer un dépôt <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return validateDepositForm();' class='transaction_form'> <div id='transaction_inner_form' class='transaction_inner_form'> <h3 class='transaction_form_title'> Veuillez selectionner le compte dans lequel vous souhaitez faire un dépôt </h3>" + accounts + "</div></form>"
}


function withdrawalPopup(){
    main_popup.classList.remove("hidden");
    popup_visible = true;
    var accounts = "";
    popup_transaction_type = 2;
    getAccountsForm(data => accounts = data);
    popup_body.innerHTML = "<h3 class='popup_title'> Effectuer un prélèvement <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return validateWithdrawalForm();' class='transaction_form'> <div id='transaction_inner_form' class='transaction_inner_form'> <h3 class='transaction_form_title'> Veuillez selectionner le compte sur lequel vous souhaitez faire un prélèvement</h3>" + accounts + "</div></form>"
}

function transferPopup(){
    main_popup.classList.remove("hidden");
    popup_visible = true;
    popup_body.innerHTML = "<h3 class='popup_title'> Effectuer un virement <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return false' class='transaction_form'> <div id='transaction_inner_form' class='transaction_inner_form'> <h3 class='transaction_form_title'> Vous souhaitez faire un virement </h3> <input type='button' value='INTERNE' onclick='transfer_internal()'> <h4> OU </h4><input type='button' onclick='transfer_external()' value='EXTERNE'></div> </form>"
}

function transfer_internal(){
    popup_transaction_type = 3;
    getAccountsForm(data => accounts = data);
    popup_body.innerHTML = "<h3 class='popup_title'> Effectuer un virement (Interne) <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return validateTransferForm(1);' class='transaction_form'> <div id='transaction_inner_form' class='transaction_inner_form'> <h3 class='transaction_form_title'> <b> ... </b> → <b>?</b><br>Le virement se fera à partir de quel compte? </h3>" + accounts + "</div></form>"

}
function transfer_external(){
    popup_transaction_type = 5;
    getAccountsForm(data => accounts = data);
    popup_body.innerHTML = "<h3 class='popup_title'> Effectuer un virement (Externe) <div class='popup_close_button' onclick='hide_popup()'>✕</div></h3><form onsubmit='return validateTransferForm(2);' class='transaction_form'> <div id='transaction_inner_form' class='transaction_inner_form'> <h3 class='transaction_form_title'> <b> ... </b> → <b>?</b><br>Le virement se fera à partir de quel compte? </h3>" + accounts + "</div></form>"

}

function accountViewSelectTab(n){
    if (currentAccount.is_current){
        if (n == 0){
            if (!account_card.classList.contains("selected")){
                for (var i=0;i<document.getElementsByClassName("account_view_tab").length;++i){
                    if (document.getElementsByClassName("account_view_tab")[i].classList.contains("selected")){
                        document.getElementsByClassName("account_view_tab")[i].classList.remove("selected");
                    }
                }
                account_card.classList.add("selected");
                account_details.innerHTML = "<div class='account_view_balance_top'> Solde : " + currentAccount.balance + "</div><h3>Ce compte n'est associé à aucune carte.</h3>"
                return
            }
        }
    }
    if (n == 1){
        if (!account_characteristics.classList.contains("selected")){
            for (var i=0;i<document.getElementsByClassName("account_view_tab").length;++i){
                if (document.getElementsByClassName("account_view_tab")[i].classList.contains("selected")){
                    document.getElementsByClassName("account_view_tab")[i].classList.remove("selected");
                }
            }
            account_characteristics.classList.add("selected");
            account_details.innerHTML = "<div class='account_view_balance_top'> Solde : " + currentAccount.balance + "</div><h3> Characteristiques du compte </h3><div class='details_view_sidebar'> <div> <b>RIB</b> : " + currentAccount.rib + "</div><div> <b> IBAN </b>: " + currentAccount.iban + "</div><div> <b> Date de creation </b>: " + currentAccount.date_created + "</div><div> <b> Propriétaire </b> : " + currentAccount.owner + "</div></div>";
        }
    }else if (n == 2){
        for (var i=0;i<document.getElementsByClassName("account_view_tab").length;++i){
            if (document.getElementsByClassName("account_view_tab")[i].classList.contains("selected")){
                document.getElementsByClassName("account_view_tab")[i].classList.remove("selected");
            }
        }
        if (!account_operations.classList.contains("selected")){
            account_operations.classList.add("selected");
            data = "";
            if (currentAccount.transactions_pending.length + currentAccount.transactions.length == 0){
                data += "<h3>Aucune opération n'a eu lieu sur ce compte.</h3>";
            }else{
                data = "<div class='transaction_view_sidebar'>";
                if (currentAccount.transactions_pending.length > 0){
                    data += "<div class='transaction_view_sidebar_title'>Operations en attente de validation : </div>";
                    for (var i=0;i<currentAccount.transactions_pending.length;++i){
                        data += transactionHtmlFormat(currentAccount.transactions_pending[i]);
                    }
                }
                if (currentAccount.transactions.length > 0){
                    dates = [];
                    for (var i=0;i<currentAccount.transactions.length;++i){
                        date = currentAccount.transactions[i].transaction_date.split("T")[0];
                        if (!dates.includes(date)){
                            dates.push(date);
                            console.log(date,dates);
                            data += "<div class='transaction_view_sidebar_title'>" + date + " : </div>";
                        }
                        data += transactionHtmlFormat(currentAccount.transactions[i]);
                    }
                }
            }
            account_details.innerHTML = "<div class='account_view_balance_top'> Solde : " + currentAccount.balance + "</div>" + data + "</div>";
        }
    }
}

function settings(){
    content.innerHTML = '<div class="settings_wrapper"> <h1 class="content_title">Réglages</h1> </div>'
}

function transactions(){
    content.innerHTML = '<div class="transactions_wrapper"> <h1 class="content_title">Opérations</h1> <div onclick="depositPopup();" class="card transaction_card">Dépôt<img src="/static/assets/deposit.png"></div><div onclick="withdrawalPopup();" class="card transaction_card">Prélèvement<img src="/static/assets/draw.png"></div><div onclick="transferPopup();" class="card transaction_card">Virement<img src="/static/assets/exchange.png"></div> </div>'
}

selectTab(0);
