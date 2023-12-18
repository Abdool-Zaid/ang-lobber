import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  init_val=localStorage['init_val']?JSON.parse(localStorage['init_val']):false;
  pause_val = localStorage['pause_val']?JSON.parse(localStorage['pause_val']):false;
  init = this.init_val?'stop':'start';
  pause=this.pause_val?'resume':'pause';
    logs = "get logs";
    render_report=false;
    report='';
    time = localStorage["time"]? JSON.parse(localStorage['time']): [];
    rep:string ='report \n'       
    pause_time:number =0 
    br_start:number= 0       
    br_end:number= 0
    logged_in_time:number = 0
    formatElapsedTime(milliseconds:number) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
  
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes % 60).padStart(2, '0');
      const formattedSeconds = String(seconds % 60).padStart(2, '0');
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  print_date(stamp:number):string{
    const date = new Date(stamp);
    return date.toLocaleString();
  }
  
  store_stamp(action:string){
    let stmp = Date.now()
    this.time.push([action,stmp])
    localStorage.setItem("time",JSON.stringify(this.time))
  }  

  start_clock() {
    this.store_stamp(this.init)
    this.init = this.init === 'start' ? 'stop' : 'start';
    this.init_val= !this.init_val
    localStorage.setItem('init_val',JSON.stringify(this.init_val))
  }
  pause_clock(){
    this.store_stamp(this.pause)
    this.pause = this.pause === 'pause' ? 'resume' : 'pause';
    this.pause_val= !this.pause_val
    localStorage.setItem('pause_val',JSON.stringify(this.pause_val))
  }
  get_log<T>(): void{
  this.render_report=!this.render_report
      if(this.time.length==0){
        alert('no logs')
        return
      }else{
        this.report= this.rep
        this.time.forEach((stamp:[string,number] )=> {
          const date = new Date(stamp[1]);
          const formattedDate = date.toLocaleString();
          this.rep += `${stamp[0]} : ${formattedDate} \n`
          if (stamp[0]=="pause") {
            this.br_start= stamp[1]
          } else if (stamp[0]=="resume") {
            this.br_end= stamp[1]
            if (this.br_start!=0) {
              this.pause_time += this.br_end-this.br_start
                
              this.br_start=0
              this.br_end=0
            }
          }
        });
        let start= this.time.at(0)[1]
        let end = this.time.at(-1)[1]
        
        let elapsed  = end - start
        this.logged_in_time= elapsed
        let elapsed_Str = this.formatElapsedTime(elapsed)
        this.rep += `elapsed time : ${elapsed_Str} \n`
        // this.report += `<p>elapsed time : ${elapsed} </p>`
        this.rep +=`on break for : ${this.formatElapsedTime(this.pause_time)}`
        // this.report +=`<p>on break for : ${this.formatElapsedTime(pause_time)}</p>`
        
        navigator.clipboard
        .writeText(this.rep)
        .then(() => {alert('logs copied to clipboard')
      })
      
      localStorage.clear()
      
    }
    
    localStorage.clear()  
  }
}