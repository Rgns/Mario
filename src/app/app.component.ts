import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent implements AfterViewInit {
  title = 'Mario App';

  _columns: number[];
  _rows: number[];

  _rowNum: number = 0;
  _colNum: number = 0;

  currentBlock: Block = {
    row: 0,
    col: 0
  };

  private readonly INITIAL_GRID_ID = "grid_0_0";


  _arr: any[][] = [];
  _cellTraversed: number = 0;
  _totalEaten: number = 0;
  _totalFood: number = 0;
  private food: Block[];


  _updateGrid(): void {
    this.initGrid();
    this.reset();
    setTimeout(() => {
      this.updateElementBackgroundById(this.INITIAL_GRID_ID);
    }, 0);
  }

  private reset(): void {
    this._cellTraversed = 0;
    this._totalEaten = 0;
    this.currentBlock = {
      row: 0,
      col: 0
    };
    for (let i = 0; i < this._arr[0].length; i++) {
      for (let j = 0; j < this._arr[0].length; j++) {
        const id = this.getId(i, j);
        this.updateElementBackgroundById(id, "white");
      }
    }
  }

  ngAfterViewInit(): void {
    this.updateElementBackgroundById(this.INITIAL_GRID_ID);
    window.addEventListener("keydown", (event) => {
      this.onKeyBoardEvent(event);
      const id = this.getId(this.currentBlock.row, this.currentBlock.col);
      this.updateElementBackgroundById(id);
    });
  }

  private getId(row: number, col: number): string {
    return "grid_" + row + "_" + col;
  }

  private updateElementBackgroundById(id: string, color?: string) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.style.background = (color ? color : "gray");
    }
  }

  private arrowKeysPressed(event): boolean {
    return (event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight");
  }

  onKeyBoardEvent(event): void {
    if ((this.currentBlock.row > 0 || this.currentBlock.row < this._rowNum - 1 )
      && (this.currentBlock.col > 0 || this.currentBlock.col < this._colNum - 1 )
      && this.arrowKeysPressed(event)
      && ( this._totalEaten !== this._totalFood)) {
      this._cellTraversed++;
    }

    switch (event.key) {
      case "ArrowUp":
        if (this.currentBlock.row > 0) {
          this.currentBlock.row--;
        }

        break;

      case "ArrowDown":
        if (this.currentBlock.row < this._rowNum - 1) {
          this.currentBlock.row++;
        }
        break;

      case "ArrowLeft":
        if (this.currentBlock.col > 0) {
          this.currentBlock.col--;
        }
        break;

      case "ArrowRight":
        if (this.currentBlock.col < this._colNum - 1) {
          this.currentBlock.col++;
        }
        break;
    }
    if (this.arrowKeysPressed(event)) {
      this.updateFoodEaten(this.currentBlock.row, this.currentBlock.col);
    }
  }


  updateFoodEaten(r, c): void {
    this.food.forEach((food: Block) => {
      if (this._arr[r][c].value === "mushroom") {
        this._totalEaten++;
        this._arr[r][c] = "";
      }
    });
  }


  private initGrid(): void {
    this.createGrid();
    this.addFood();
  }


  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }


  private addFood(): void {
    const noOfFood: number = Math.min(this._rowNum, this._colNum);
    this.food = [];
    for (let i = 0; i < noOfFood; i++) {
      this.food.push({
        row: this.getRandomInt(1, noOfFood),
        col: this.getRandomInt(1, noOfFood)
      });
    }
    this.updateGameWithFood(this.food);
  }

  private updateGameWithFood(food: Block[]): void {
    this.food = food;
    this._totalFood = food.length;
    for (const item of food) {
      this._arr[item.row][item.col] = {
        value: "mushroom",
        image: "../assets/mushroom.jpg"
      };

    }
  }

  private createGrid(): void {
    const arr: number[][] = [];
    this._columns = new Array(this._colNum);
    this._rows = new Array(this._rowNum);
    for (let row = 0; row < this._rowNum; row++) {
      const newArr = [];
      for (let col = 0; col < this._colNum; col++) {
        newArr[col] = "";
        arr[row] = newArr;
      }
    }
    this._arr = arr;
  }


}

export class Block {
  row: number;
  col: number;

}
