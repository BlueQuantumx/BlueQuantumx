# Polynomial

## 多项式乘法 NTT

---

### 前置知识

#### 原根

若存在 $g$ 且使得 $g^k \equiv 1 \pmod p$ 的最小正整数为 $\varphi(p)$，则 $g$ 为 $p$ 的原根

以下讨论中选择 $p$ 为质数

$n$ 次单位根 $w_n = g^{\frac {p-1} n}$

**一些性质**

- $w_n^{2i} = w_{\frac{n}{2}}^i$
- $w_n^i = -w_n^{i+\frac{n}{2}}$

---

### 主过程

$$
\begin{aligned}
f &= [A_0, A_1, A_2, \cdots, A_{n-1}] \\
f(w_n^i) &= A_0 + A_1w_n^i + A_2w_n^{i2} + \cdots + A_{n-1}w_n^{i(n-1)} \\
f_1 &= [A_0, A_2, A_4, \cdots, A_{n-2}] \\
f_2 &= [A_1, A_3, A_5, \cdots, A_{n-1}] \\
f(w_n^i) &= f_1(w_n^{i2}) + w_n^if_2(w_n^{i2}) \\
f(w_n^i) &= f_1(w_{\frac{n}{2}}^{i}) + w_n^if_2(w_{\frac{n}{2}}^{i}) \\
f(w_n^{i+\frac{n}{2}}) &= f_1(w_{\frac{n}{2}}^{i}) - w_n^if_2(w_{\frac{n}{2}}^{i})
\end{aligned}
$$

## 多项式乘法逆 Inv

倍增处理，假设已经求出 $\pmod {x^\frac{n}{2}}$ 意义下的逆元记为 $inv_0$

$$
\begin{aligned}
f * inv_0 &\equiv 1 \pmod {x^\frac{n}{2}} \\
f * inv &\equiv 1 \pmod {x^n} \\
f * (inv - inv_0) &\equiv 0 \pmod {x^\frac{n}{2}} \\
inv - inv_0 &\equiv 0 \pmod {x^\frac{n}{2}}
\end{aligned}
$$

因为 $inv - inv_0$ 最低系数不为零的项次数为 $x^\frac{n}{2}$ 平方后 最低系数不为零的项次数为 $x^n$ 所以

$$
\begin{aligned}
(inv - inv_0)^2 &\equiv 0 \pmod {x^n} \\
inv^2 + inv_0^2 - 2inv * inv_0 &\equiv 0 \pmod {x^n}
\end{aligned}
$$

两边同时乘 $f$

$$
\begin{aligned}
inv + inv_0^2*f - 2inv_0 &\equiv 0 \pmod {x^n} \\
inv &\equiv 2inv_0 - inv_0^2*f \pmod {x^n}
\end{aligned}
$$

## 多项式对数函数 Ln

先微分再积分

$$
g' = (\ln f)' = \frac{f'}{f}
$$

## 多项式指数函数 Exp

$$
g = e^f \\
$$

设 $h(g) = \ln g - f$ 其中 $g$ 为多项式

求 $h(g) \equiv 0 \pmod {x^n}$ 的根，考虑牛顿迭代法

假设已经求出 $h(g_0) \equiv 0 \pmod {x^\frac{n}{2}}$

$$
h(g) = h(g_0) + \frac{h'(g_0)}{1!}(g-g_0) + \frac{h''(g_0)}{2!}(g-g_0)^2 + \cdots
$$

因为 $g - g_0$ 最低系数不为零的项次数为 $x^\frac{n}{2}$ 平方后 最低系数不为零的项次数为 $x^n$ 所以

$$
\begin{aligned}
h(g) &\equiv h(g_0) + h'(g_0) * (g-g_0) \pmod {x^n} \\
0 &\equiv h(g_0) + h'(g_0) * (g-g_0) \pmod {x^n} \\
g &\equiv g_0 - \frac{h(g_0)}{h'(g_0)} \pmod {x^n} \\
g &\equiv g_0 - g_0 * (\ln g_0 - f) \pmod {x^n} \\
g &\equiv g_0 * (f - \ln g_0 + 1) \pmod {x^n}
\end{aligned}
$$

## 多项式快速幂 Pow

$$
\begin{aligned}
ans &= f^k \\
\ln ans &= \ln f^k \\
\ln ans &= k\ln f \\
ans &= e^{k\ln f} \ \text{(ignore the constant)}
\end{aligned}
$$

```cpp
/// @tags: NTT Polynomial
#include <algorithm>
#include <cctype>
#include <cstdio>
#include <cstring>

typedef long long ll;

int const N = 1 << 18, P = 998244353, g = 3, ig = 332748118, inv2 = 499122177;

template <typename T>
inline T &read(T &x) {
  x = 0;
  bool F = false;
  short ch = getchar();
  while (!isdigit(ch)) {
    if (ch == '-') F = true;
    ch = getchar();
  }
  while (isdigit(ch)) x = x * 10ll % P + (ch ^ '0'), ch = getchar();
  if (F) x = -x;
  return x;
}

template <typename T>
inline T &readmod(T &x) {
  x = 0;
  bool F = false;
  short ch = getchar();
  while (!isdigit(ch)) {
    if (ch == '-') F = true;
    ch = getchar();
  }
  while (isdigit(ch)) x = 1ll * x * 10 % P + (ch ^ '0'), ch = getchar();
  if (F) x = -x;
  return x;
}

class Polynomial {
 private:
  int F[N];
  static int Cvt[N << 2];

 public:
  void NTT(bool const typ, int const n);
  void inv(Polynomial &Res, int const n) const;
  void ln(Polynomial &Res, int const n) const;
  void exp(Polynomial &Res, int const n) const;
  void pow(Polynomial &Res, int const n, int const k) const;
  void sqrt(Polynomial &res, int const n) const;
  void div(Polynomial &Q, Polynomial &R, Polynomial const &D, int const n,
           int const m) const;
  int *operator&() { return F; }
  int &operator[](int index) { return F[index]; };
  int const &operator[](int index) const { return F[index]; };
  inline void pre(int n) {
    for (int i = 1, len = 2; len <= n; ++i, len <<= 1)
      for (int j = 1, *const cvt = Cvt + len - 1; j < len; ++j)
        cvt[j] = cvt[j >> 1] >> 1 | ((j & 1) << (i - 1));
  }
  inline void clear(int n) {
    int maxl = 1;
    while (maxl < n) maxl <<= 1;
    memset(F, 0, sizeof(int) * maxl);
  }
} F, G;

int n, m;
int Polynomial::Cvt[N << 2];

inline ll qpow(ll base, int exp) {
  ll Res = 1;
  while (exp) {
    if (exp & 1) Res = Res * base % P;
    base = base * base % P;
    exp >>= 1;
  }
  return Res;
}

/// @param typ 正/逆向 @param n 项数 必须是2的整数次幂
inline void Polynomial::NTT(bool const typ, int const n) {
  for (int i = 1, *const cvt = Cvt + n - 1; i < n; ++i)
    if (i < cvt[i]) std::swap(F[i], F[cvt[i]]);
  for (int i = 2; i <= n; i <<= 1) {
    int mid = i >> 1, wn = qpow(typ ? g : ig, (P - 1) / i);
    for (int j = 0; j < n; j += i) {
      ll wk = 1;
      for (int k = 0; k < mid; ++k, (wk *= wn) %= P) {
        ll t = wk * F[j + k + mid] % P;
        if ((F[j + k + mid] = F[j + k] - t) < 0) F[j + k + mid] += P;
        if ((F[j + k] += t) >= P) F[j + k] -= P;
      }
    }
  }
  if (!typ) {
    ll inv = qpow(n, P - 2);
    for (int i = 0; i < n; ++i) F[i] = inv * F[i] % P;
  }
}

/// @param Res 应清空 @param n 模的次数（项数）
inline void Polynomial::inv(Polynomial &Res, int const n) const {
  static Polynomial tmp;
  if (n == 1) return Res[0] = qpow(F[0], P - 2), void();
  inv(Res, (n + 1) >> 1);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;  // n - 1 次多项式卷 ⌈n / 2⌉ - 1 次多项式
  tmp.clear(n << 1);
  memcpy(&tmp, F, sizeof(int) * n);
  tmp.NTT(true, maxl), Res.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i)
    Res[i] = static_cast<ll>(Res[i]) *
             ((2ll - static_cast<ll>(Res[i]) * tmp[i] % P + P) % P) % P;
  Res.NTT(false, maxl);
  for (int i = n; i < maxl; ++i) Res[i] = 0;  // mod x^n
}

inline void Polynomial::ln(Polynomial &Res, int const n) const {
  static Polynomial df, invf;
  df.clear(n << 1), invf.clear(n << 1);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  for (int i = 0; i + 1 < n; ++i) df[i] = static_cast<ll>(F[i + 1]) * (i + 1) % P;
  inv(invf, n);
  invf.NTT(true, maxl), df.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i) Res[i] = static_cast<ll>(df[i]) * invf[i] % P;
  Res.NTT(false, maxl);
  for (int i = n - 1; i; --i) Res[i] = static_cast<ll>(Res[i - 1]) * qpow(i, P - 2) % P;
  Res[0] = 0;
}

inline void Polynomial::exp(Polynomial &Res, int const n) const {
  static Polynomial lnres;
  if (n == 1) { return Res[0] = 1, void(); }
  exp(Res, (n + 1) >> 1);
  Res.ln(lnres, n);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  for (int i = 0; i < n; ++i)
    if ((lnres[i] = F[i] - lnres[i]) < 0) lnres[i] += P;
  ++lnres[0];
  if (lnres[0] >= P) lnres[0] -= P;
  lnres.NTT(true, maxl), Res.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i) Res[i] = static_cast<ll>(Res[i]) * lnres[i] % P;
  Res.NTT(false, maxl);
  for (int i = n; i < maxl; ++i) Res[i] = 0;
}

inline void Polynomial::pow(Polynomial &Res, int const n, int const k) const {
  static Polynomial tmp;
  ln(tmp, n);
  for (int i = 0; i < n; ++i) tmp[i] = 1ll * tmp[i] * k % P;
  tmp.exp(Res, n);
}

/// @param Q Quotient @param R Remainder @param D divider
inline void Polynomial::div(Polynomial &Q, Polynomial &R, Polynomial const &D,
                            int const n, int const m) const {
  static Polynomial Dr, iDr, Fr;
  for (int i = 0; i <= m; ++i) Dr[i] = D[m - i];
  for (int i = 0; i <= n; ++i) Fr[i] = F[n - i];
  Dr.inv(iDr, n - m + 1);
  int maxl = 1;
  while (maxl <= n + m) maxl <<= 1;
  iDr.NTT(true, maxl << 1), Fr.NTT(true, maxl << 1);
  for (int i = 0; i < maxl << 1; ++i) Q[i] = 1ll * iDr[i] * Fr[i] % P;
  Q.NTT(false, maxl << 1);
  for (int i = n - m + 1; i < maxl << 1; ++i) Q[i] = 0;
  std::reverse(&Q, &Q + n - m + 1);
  std::reverse(&Dr, &Dr + m + 1);
  Q.NTT(true, maxl << 1), Dr.NTT(true, maxl << 1);
  for (int i = 0; i < maxl << 1; ++i) R[i] = 1ll * Q[i] * Dr[i] % P;
  R.NTT(false, maxl << 1), Q.NTT(false, maxl << 1);
  for (int i = 0; i < m; ++i)
    if ((R[i] = F[i] - R[i]) < 0) R[i] += P;
}

/// @param Res 应清空 @param n 模的次数（项数）
inline void Polynomial::sqrt(Polynomial &Res, int const n) const {
  static Polynomial Resinv, copyF;
  if (n == 1) { return Res[0] = 1, void(); }
  sqrt(Res, (n + 1) >> 1);
  for (int i = 0; i <= n << 1; ++i) Resinv[i] = 0;
  Res.inv(Resinv, n);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  memcpy(&copyF, F, sizeof(int) * n);
  for (int i = n; i < maxl; ++i) copyF[i] = 0;
  copyF.NTT(true, maxl), Resinv.NTT(true, maxl), Res.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i)
    /// @warning        P 过大时可能会炸 ↓
    if ((Res[i] = 1ll * inv2 * (Res[i] + 1ll * copyF[i] * Resinv[i] % P) % P) >= P)
      Res[i] -= P;
  Res.NTT(false, maxl);
  for (int i = n; i < maxl; ++i) Res[i] = 0;
}

int main() {
#ifndef ONLINE_JUDGE
#ifdef LOCAL
  freopen("/tmp/CodeTmp/testdata.in", "r", stdin);
  freopen("/tmp/CodeTmp/testdata.out", "w", stdout);
#else
  freopen("Polynomial.in", "r", stdin);
  freopen("Polynomial.out", "w", stdout);
#endif
#endif

  read(n);
  for (int i = 0; i < n; ++i) read(F[i]);
  F.pre(n << 2);
  F.sqrt(G, n);
  for (int i = 0; i < n; ++i) printf("%d ", G[i]);
  return 0;
}
```