import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AppService } from './app.service';
import { MatSort } from '@angular/material/sort';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  title = 'amn-app';
  llantas: any;
  convertedObj:any = "";

  displayedColumns: string[] = ['clasificacion', 'marca', 'modelo', 'origen', 'rin', 'tipo', 'subtipo', 'existencia', 'precio', 'utilidad'];
  dataSource: any;
  loading: boolean;
  jsonFixed = [];

  constructor(
    private _appService: AppService,
    private _titleCase: TitleCasePipe,
  ) {

  }

  getLlantas() {
    this.loading = true;
    this._appService.getLlantas()
      .subscribe((res) => {
        this.llantas = res.objects.ResponseRow;
        console.log(this.llantas);
        this.dataSource = new MatTableDataSource(this.llantas);

        this.dataSource.sort = this.sort;
        this.loading = false;

      },
        error => {
          this.loading = false;
          console.log(error);
        });
  }

  getPrueba() {
    this.loading = true;
    this._appService.getPrueba()
      .subscribe((res) => {
        this.loading = false;

      },
        error => {
          this.loading = false;
          console.log(error);
        });
  }

  createCSV() {
    this.llantas.map((llanta) => {
      if (llanta.Existencia >= 8) {

        let vendorFixed = this._titleCase.transform(llanta.Marca);
        let utilidadFixed = Math.ceil(llanta.utilidad / 10) * 10;

        if (llanta.promoUtilidad) {

          let promoUtilidadFix = Math.ceil(llanta.promoUtilidad / 10) * 10;

          this.jsonFixed.push({
            'Handle': llanta.Marca + '-' + llanta.Modelo,
            'Title': llanta.Marca + ' ' + llanta.Modelo,
            'Body (HTML)': "<p><span class='desc-bold'>Marca: </span>" + llanta.Marca + "</p><p><span class='desc-bold'>Modelo: </span>" + llanta.Modelo + "</p><p><span class='desc-bold'>Categoría: </span>" + llanta.Subtipo + "</p><p><span class='desc-bold'>Medida: </span>" + llanta.medidas + "</p>",
            'Vendor': vendorFixed,
            'Type': llanta.clasificacion,
            'Tags': '"' + llanta.Marca + ', ' + llanta.Alto + ' alto' + ', ' + llanta.Ancho + ' ancho' + ', ' + llanta.Rin + ' rin' + ', ' + llanta.precio + ', ' + llanta.Modelo + ', ' + llanta.Tipo + ', ' + llanta.Subtipo + ', ' + llanta.medidas + '"',
            'Published': 'TRUE',
            'Option1 Name': 'Title',
            'Option1 Value': 'Default Title',
            'Option2 Name': '',
            'Option2 Value': '',
            'Option3 Name': '',
            'Option3 Value': '',
            'Variant SKU': '',
            'Variant Grams': 0,
            'Variant Inventory Tracker': 'shopify',
            'Variant Inventory Qty': llanta.Existencia,
            'Variant Inventory Policy': 'deny',
            'Variant Fulfillment Service': 'manual',
            'Variant Price': promoUtilidadFix,
            'Variant Compare At Price': utilidadFixed,
            'Variant Requires Shipping': 'TRUE',
            'Variant Taxable': 'TRUE',
            'Variant Barcode': '',
            'Image Src': llanta.imageUrl,
            'Image Position': 1,
            'Image Alt Text': '',
            'Gift Card': 'FALSE',
            'SEO Title': llanta.Descripcion,
            'SEO Description': llanta.Descripcion,
            'Variant Image': '',
            'Variant Weight Unit': '',
            'Variant Tax Code': '',
            'Cost per item': '',
            'Status': 'active',
          })
        }
        else {
          this.jsonFixed.push({
            'Handle': llanta.Marca + '-' + llanta.Modelo,
            'Title': llanta.Marca + ' ' + llanta.Modelo,
            'Body (HTML)': "<p><span class='desc-bold'>Marca: </span>" + llanta.Marca + "</p><p><span class='desc-bold'>Modelo: </span>" + llanta.Modelo + "</p><p><span class='desc-bold'>Categoría: </span>" + llanta.Subtipo + "</p><p><span class='desc-bold'>Medida: </span>" + llanta.medidas + "</p>",
            'Vendor': vendorFixed,
            'Type': llanta.clasificacion,
            'Tags': '"' + llanta.Marca + ', ' + llanta.Alto + ' alto' + ', ' + llanta.Ancho + ' ancho' + ', ' + llanta.Rin + ' rin' + ', ' + llanta.precio + ', ' + llanta.Modelo + ', ' + llanta.Tipo + ', ' + llanta.Subtipo + ', ' + llanta.medidas + '"',
            'Published': 'TRUE',
            'Option1 Name': 'Title',
            'Option1 Value': 'Default Title',
            'Option2 Name': '',
            'Option2 Value': '',
            'Option3 Name': '',
            'Option3 Value': '',
            'Variant SKU': '',
            'Variant Grams': 0,
            'Variant Inventory Tracker': 'shopify',
            'Variant Inventory Qty': llanta.Existencia,
            'Variant Inventory Policy': 'deny',
            'Variant Fulfillment Service': 'manual',
            'Variant Price': utilidadFixed,
            'Variant Compare At Price': '',
            'Variant Requires Shipping': 'TRUE',
            'Variant Taxable': 'TRUE',
            'Variant Barcode': '',
            'Image Src': llanta.imageUrl,
            'Image Position': 1,
            'Image Alt Text': '',
            'Gift Card': 'FALSE',
            'SEO Title': llanta.Descripcion,
            'SEO Description': llanta.Descripcion,
            'Variant Image': '',
            'Variant Weight Unit': '',
            'Variant Tax Code': '',
            'Cost per item': '',
            'Status': 'active',
          })
        }
      }
    });
    this._appService.downloadFile(this.jsonFixed, 'export-inventory')
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convert(objArray){    
    //this.convertedObj = JSON.stringify(objArray.result, null, 2);   
    
    this.loading = true;
    const llantas = objArray.result;
    let jsonArrayObject = [];

    llantas.forEach(function(e){
      if (typeof e === "object" ){
        var ancho = "";
        var alto = "";
        var rin = "";
        var utilidad = 0;
        var clasificacion = "";
        var medida = e["MEDIDA"];   
        var precio = Number(e["PREC.LISTACIVA"]);    

        if(medida != undefined && medida.indexOf("/") !== -1)
        {
          ancho = medida.substring(0, 3);
          alto = medida.substring(4, 7);           
          if(Number(ancho) >= 155 && Number(ancho) <= 225)
            clasificacion = "auto";
          else if(Number(ancho) >= 235 && Number(ancho) <= 345)
          clasificacion = "camioneta";         
        }
        if(medida != undefined && medida.indexOf("R") !== -1)
        {
          rin = medida.substring(medida.indexOf("R"), medida.length).replace("R","");                    
          if(Number(rin) == 17.5 || Number(rin) == 19.5 || Number(rin) == 22.5 || Number(rin) == 24.5)
            clasificacion = "camion";
        }

        if (clasificacion == 'camion') {
          utilidad = precio * 1.16 * 1.15 + 100;
        }
        else {
          utilidad = precio * 1.16 * 1.25 + 50;
        }


        var obj =
        {
          "Alto": alto,
          "Ancho": ancho,
          "Capas": "",
          "Cubicaje": "",
          "Descripcion": "Llanta " + e["MEDIDA"] + " " + e["MODELO"] + " " + e["LINEA"], 
          "Existencia": e["Disp"],          
          "Marca": e["MODELO"],
          "Modelo": e["LINEA"],
          "Moneda": "MXN",
          "Origen": "",          
          "Rin": rin,
          "SKU": e["ARTICULO"],
          "Subtipo": "",
          "Tipo": e["Tipo"],      
          "clasificacion": clasificacion,
          "imageUrl": "https://drive.google.com/uc?export=view&id=1atciONzllKBdGa4whn0OH8CemT8X8a1Y",    
          "medidas": e["MEDIDA"],
          "precio": Number(e["PREC.LISTACIVA"]) / 1.16,
          "utilidad": utilidad
        }
      }

      jsonArrayObject.push(obj);
    });   
    
    this.dataSource = new MatTableDataSource(jsonArrayObject);
    this.dataSource.sort = this.sort;
    this.loading = false;       
    this.llantas = jsonArrayObject;
    console.log(this.llantas);
   }

   onError(err){
     console.log(err);
     this.loading = false;       
   }

  /*  GoogleShoppingGoogleProductCategory: '',
  GoogleShoppingGender: '',
  GoogleShoppingAgeGroup: '',
  GoogleShoppingMPN: '',
  GoogleShoppingAdWordsGrouping: '',
  GoogleShoppingAdWordsLabels: '',
  GoogleShoppingCondition: '',
  GoogleShoppingCustomProduct: '',
  GoogleShoppingCustomLabel0: '',
  GoogleShoppingCustomLabel1: '',
  GoogleShoppingCustomLabel2: '',
  GoogleShoppingCustomLabel3: '',
  GoogleShoppingCustomLabel4: '',*/
}
